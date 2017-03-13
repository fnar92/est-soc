(function () { 
    'use strict';
	
    angular
	.module('app.estudios')
	.controller('EstudiosVerController', EstudiosVerController);
    
    function EstudiosVerController (EstudiosService, ComentarioService, $localStorage, $rootScope, $state, $mdDialog, $mdToast, DialogService, RestService, AuthenticationService, Constants, UserService, $q) {
        /* jshint validthis: true */
        console.log('init estudios ver');
        
        //Check session
        AuthenticationService.isAuth();
        
        var scope = this;  
        
        scope.listaEstudios=[];
        scope.estudio={};
        scope.familia={};
        scope.familia.familia='paco';
        scope.filtroFamilia="";
        scope.tipoUsuario=$localStorage.globals.type;
        scope.currentPage =0;
        scope.pageSize = 7;
        scope.numberOfPages = numberOfPages;
        
        //Banderas
        scope.load=false;
        scope.verAccion=false;
        
        scope.entrevista={};
        
        //acctiones
        scope.buscarEstudios=buscarEstudios;
        scope.verDetalle=verDetalle;
        scope.agendarView=agendarView;
        scope.agendarEstudio=agendarEstudio;
        scope.reagendarEstudio=reagendarEstudio;
        scope.cancelarEstudio=cancelarEstudio;
        scope.agendarSave=agendarSave;
        scope.reagendarEstudioSave=reagendarEstudioSave;
        scope.cancelarCita=cancelarCita;
        scope.cancelarCitaSave=cancelarCitaSave;
       
       
        if (!$localStorage.globals||!$rootScope.isAuth) {
            mensaje('error', 'Session', 'Tu session ha expirado.');
            location.href='#/login';
        }
        
        if($rootScope.tipoUsuario===2){
            if($rootScope.user.id_institucion===undefined){
                error();
                location.href='#/';
            }
        }
        
        scope.buscarEstudios();
        
        
        function buscarEstudios(){
            scope.bandera_busco=false;
            scope.load=true;
            EstudiosService.obtenerEstudios(
                    $rootScope.tipoUsuario,
                    $rootScope.rolUsuario,
                    $rootScope.user.id_usuario,
                    $rootScope.user.id_institucion,
                    scope.filtroFamilia
                    )
                .then(
                    function(response){
                        scope.load=false;
                        scope.listaEstudios=response.data;
                    },
                    function(error){
                        scope.load=false;
                        console.log('Error al obtener los estudios');
                    }
                );
            
        };
        
        function verDetalle(idEstudio){
            show();
            EstudiosService.idEstudioSeleccionado=idEstudio;
            window.location.href='#/estudios/detalle';
        };
        
        
        function numberOfPages(){
            return Math.ceil(scope.listaEstudios.length/scope.pageSize);  
        };
        
        function agendarView(estudio){
            show();
            scope.entrevista={};
            scope.estudio={};
            scope.estudio=estudio;
            EstudiosService.obtenerDetalleEstudio(scope.estudio.id_estudio, 0).then(
                function(response){
                    scope.familia=response.data;
                    hide();
                    $("#modal_agendar").modal('show');
                },
                function(error){
                    console.log('Error al obtener el detalle: '+error);
                }
            );
            
        }
        
        function agendarEstudio(){
            scope.entrevista={};
            $("#modal_agendar_entrevista").modal('show');
        }

        function agendarSave(){
            if(scope.entrevista.fecha_entrevista===undefined||scope.entrevista.fecha_entrevista===""){
                mensaje("alert", 'Error de validación', 'La fecha de entrevista es requerida.');
                return;
            }
            var obj={};
            var obj2={};
            obj.id_estudio=scope.estudio.id_estudio;
            obj.id_estatus_estudio=3;
            obj.fecha_entrevista=scope.entrevista.fecha_entrevista;
            obj2.comentario=scope.entrevista.comentarios;
            obj2.tipo='ACEPTO_ENTREVISTA';
            obj2.id_estudio=scope.estudio.id_estudio;
            obj2.folio_estudio=scope.estudio.folio_estudio;
            obj2.id_familia=scope.estudio.id_familia;
            
            confirmaMsj(
                "Confirmación de solicitud",
                "¿Agendar estudio?",
                "Si",
                    function(){
                        var promesas=[];
                        promesas.push(EstudiosService.actualizarEstudio(obj));
                        if(scope.entrevista.comentarios!==undefined&&scope.entrevista.comentarios!==""){
                            promesas.push(ComentarioService.guardarComentario(obj2));
                        }
                        $q.all(promesas).then(
                            function(data){
                                console.log(data);
                                scope.familia={};
                                scope.estudio={};
                                mensaje('success', 'Aviso.', 'Se agendo el estudio correctamente.');
                                scope.buscarEstudios();
                                $("#modal_agendar_entrevista").modal('hide');
                                $("#modal_agendar").modal('hide');
                                },
                            function(){
                                console.log('error prom');
                            }
                        );
                    },
                "No",
                    function(){}
            );
        }
        
        function reagendarEstudio(){
            scope.entrevista={};
            $("#modal_reagendar_entrevista").modal('show');
        }
        
        function reagendarEstudioSave(){
            if(scope.entrevista.fecha_reagendar_entrevista===undefined||scope.entrevista.fecha_reagendar_entrevista===""){
                mensaje("alert", 'Error de validación', 'La fecha de reagendar entrevista es requerida.');
                return;
            }
            if(scope.entrevista.comentarios===undefined||scope.entrevista.comentarios===""){
                mensaje("alert", 'Error de validación', 'El comentario es requerido para especificar el motivo por el cual se reagenda la entrevista.');
                return;
            }
            var obj={};
            obj.id_estudio=scope.estudio.id_estudio;
            obj.id_estatus_estudio=4;
            obj.fecha_reagendar_entrevista=scope.entrevista.fecha_reagendar_entrevista;
            var obj2={};
            obj2.comentario=scope.entrevista.comentarios;
            obj2.tipo='REAGENDO_ENTREVISTA';
            obj2.id_estudio=scope.estudio.id_estudio;
            obj2.folio_estudio=scope.estudio.folio_estudio;
            obj2.id_familia=scope.estudio.id_familia;
            
            confirmaMsj(
                "Confirmación de solicitud",
                "¿Reagendar estudio?",
                "Si",
                    function(){
                        var promesas=[];
                        promesas.push(EstudiosService.actualizarEstudio(obj));
                        if(scope.entrevista.comentarios!==undefined&&scope.entrevista.comentarios!==""){
                            promesas.push(ComentarioService.guardarComentario(obj2));
                        }
                        $q.all(promesas).then(
                            function(data){
                                console.log(data);
                                scope.familia={};
                                scope.estudio={};
                                mensaje('success', 'Aviso.', 'Se reagendo el estudio correctamente.');
                                scope.buscarEstudios();
                                $("#modal_agendar").modal('hide');
                                $("#modal_reagendar_entrevista").modal('hide');
                                },
                            function(){
                                console.log('error prom');
                            }
                        );
                    },
                "No",
                    function(){}
            );
        }
        
        function cancelarEstudio(estudio){
            confirmaMsj("Confirmación de solicitud",
                "¿Está seguro que desea cancelar el estudio?",
                "Si",
                function(){
                    EstudiosService.cancelarEstudioInstitucion(estudio.id_estudio_institucion).then(
                        function(response){
                            mensaje('success', 'Cancelar estudio', 'Se cancelo el estudio correctamente.');
                            scope.buscarEstudios();
                            window.location='#/estudios/ver';
                        },
                        function(error){
                            console.log('Error al cancelar el estudio: '+error);
                        }
                    );
                },
                "No",
                function(){}
            );
        }
        
        
        function cancelarCita(estudio){
            scope.estudio=estudio;
            scope.entrevista={};
            $("#modal_cancelar_entrevista").modal('show');
        }
        
        function cancelarCitaSave(){
            if(scope.entrevista.fecha_reagendar_entrevista===undefined||scope.entrevista.fecha_reagendar_entrevista===""){
                mensaje("alert", 'Error de validación', 'La fecha de reagendar entrevista es requerida.');
                return;
            }
            if(scope.entrevista.comentarios===undefined||scope.entrevista.comentarios===""){
                mensaje("alert", 'Error de validación', 'El comentario es requerido para especificar el motivo de la cancelación de la entrevista.');
                return;
            }
            var obj={};
            obj.id_estudio=scope.estudio.id_estudio;
            obj.id_estatus_estudio=9;
            obj.fecha_reagendar_entrevista=scope.entrevista.fecha_reagendar_entrevista;
            var obj2={};
            obj2.comentario=scope.entrevista.comentarios;
            obj2.tipo='CANCELO_ENTREVISTA';
            obj2.id_estudio=scope.estudio.id_estudio;
            obj2.folio_estudio=scope.estudio.folio_estudio;
            obj2.id_familia=scope.estudio.id_familia;
            console.log(obj);
            console.log(obj2);
            
            confirmaMsj(
                "Confirmación de solicitud",
                "¿Cancelar entrevista del estudio?",
                "Si",
                    function(){
                        var promesas=[];
                        promesas.push(EstudiosService.actualizarEstudio(obj));
                        if(scope.entrevista.comentarios!==undefined&&scope.entrevista.comentarios!==""){
                            promesas.push(ComentarioService.guardarComentario(obj2));
                        }
                        $q.all(promesas).then(
                            function(data){
                                console.log(data);
                                scope.familia={};
                                scope.estudio={};
                                mensaje('success', 'Aviso.', 'Se cancelo entrevista del estudio correctamente.');
                                scope.buscarEstudios();
                                $("#modal_agendar").modal('hide');
                                $("#modal_cancelar_entrevista").modal('hide');
                                },
                            function(){
                                console.log('error prom');
                            }
                        );
                    },
                "No",
                    function(){}
            );
        }
        
       
   
        
    };//end controller

})();