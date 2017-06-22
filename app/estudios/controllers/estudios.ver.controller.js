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
        scope.listaEstudiosMostrar = [];
        scope.busqueda = {ciclo_escolar:"", id_usuario_asignado:"", id_estatus_estudio:""}
        scope.cambiaFiltro = cambiaFiltro;
        scope.estudio={};
        scope.familia={};
        scope.familia.familia='paco';
        scope.filtroFamilia="";
        scope.tipoUsuario=$localStorage.globals.type;
        scope.currentPage =0;
        scope.pageSize = 7;
        scope.numberOfPages = numberOfPages;
        scope.seleccionados=[];
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
        scope.cicloEscolar={};
        scope.listaCiclos=[];
        scope.listaEmpleado=[];
        scope.listaEstatus=[];
       
        if (!$localStorage.globals||!$rootScope.isAuth) {
            mensaje('error', 'Session', 'Tu session ha expirado.');
            location.href='#/login';
        }
        if($rootScope.user.id_usuario===undefined){
            error();
            location.href='#/';
        }
        if($rootScope.tipoUsuario===2){
            if($rootScope.user.id_institucion===undefined){
                error();
                location.href='#/';
            }
        }
        
        //Traer el periodo/año actual
        var parametros={};
        parametros.tipoUsuario=$rootScope.tipoUsuario;
        parametros.rolUsuario=$rootScope.rolUsuario;
        parametros.idUsuario=$rootScope.user.id_usuario;
        parametros.idInstitucion=$rootScope.user.id_institucion;
        parametros.filtroFamilia=scope.filtroFamilia;


        
        
        var promesas=[];
        promesas.push(EstudiosService.obtenerCicloEscolarCat());
        promesas.push(EstudiosService.obtenerEmpleados());
        promesas.push(EstudiosService.obtenerEstatusCat());
        promesas.push(EstudiosService.obtenerCicloEscolar());

        $q.all(promesas).then(
            function(response){
                    scope.listaCiclos=response[0].data;
                    scope.listaEmpleados=response[1].data;
                    scope.listaEstatus=response[2].data;
                    var parametros={};
                    parametros.tipoUsuario=$rootScope.tipoUsuario;
                    parametros.rolUsuario=$rootScope.rolUsuario;
                    parametros.idUsuario=$rootScope.user.id_usuario;
                    parametros.idInstitucion=$rootScope.user.id_institucion;
                    parametros.filtroFamilia=scope.filtroFamilia;
                    
                    scope.cicloEscolar=response[3].data[0];
                    parametros.cicloEscolar=scope.cicloEscolar.ciclo_escolar;
                    parametros.ciclos=[];
                    parametros.ciclos.push(scope.cicloEscolar.ciclo_escolar);
                    scope.seleccionados.push(scope.cicloEscolar.ciclo_escolar);
                    console.log(scope.seleccionados);
                    EstudiosService.obtenerEstudios(parametros)
                .then(
                    function(response){
                        scope.load=false;
                        scope.listaEstudios=response.data;
                        scope.listaEstudiosMostrar=scope.listaEstudios;
                        scope.seleccionados=[];
                    },
                    function(error){
                        scope.load=false;
                        console.log('Error al obtener los estudios');
                        error();
                    }
                );
            }, 
            function (error){
                console.log('Error getEstudios: '+error);
            }
        );
                
                
        function cambiaFiltro(){
            console.log("iniciaFiltro");
            scope.listaEstudiosMostrar = [];
            //scope.listaEstudiosMostrar=scope.listaEstudios;
            for(var i=0;i<scope.listaEstudios.length;i++){
                var banNombre = false;
                var banEstatus = false;
                var banTipo = false;
                
                if(scope.busqueda.ciclo_escolar === ""){
                    banNombre = true;
                }else if(scope.listaEstudios[i].ciclo_escolar ===  scope.busqueda.ciclo_escolar){
                    banNombre = true;
                };
                
                if(scope.busqueda.id_usuario_asignado === ""){
                    banEstatus = true;
                }else if(scope.listaEstudios[i].id_usuario_asignado === scope.busqueda.id_usuario_asignado){
                    banEstatus = true;
                };
                
                if(scope.busqueda.id_estatus_estudio === ""){
                    banTipo = true;
                }else if(scope.listaEstudios[i].id_estatus_estudio === scope.busqueda.id_estatus_estudio){
                    banTipo = true;
                };
                
                
                if(banTipo && banEstatus && banNombre){
                    scope.listaEstudiosMostrar.push(scope.listaEstudios[i]);
                };
            };
            console.log("scope.listaEstudiosMostrar:"+scope.listaEstudiosMostrar.length);
            scope.currentPage=0;
        };
        
        function buscarEstudios(){
            var ciclos = [];
            var list=scope.listaCiclos;
            angular.forEach(list, function (value, key) {
                if (list[key].selected === list[key].ciclo_escolar) {
                    ciclos.push(list[key].ciclo_escolar);
                }
            });
            
            scope.listaEstudiosMostrar=[];
            scope.bandera_busco=false;
            scope.load=true;
            var parametros={};
            parametros.tipoUsuario=$rootScope.tipoUsuario;
            parametros.rolUsuario=$rootScope.rolUsuario;
            parametros.idUsuario=$rootScope.user.id_usuario;
            parametros.idInstitucion=$rootScope.user.id_institucion;
            parametros.filtroFamilia=scope.filtroFamilia;
            var push=[];
            if(ciclos.length===0){
                push.push(scope.cicloEscolar.ciclo_escolar);
            }else{
                push=ciclos;
            }
            parametros.ciclos=push;
            
            EstudiosService.obtenerEstudios(parametros)
                .then(
                    function(response){
                        scope.load=false;
                        scope.listaEstudios=response.data;
                        scope.listaEstudiosMostrar=scope.listaEstudios;
                    },
                    function(error){
                        scope.load=false;
                        console.log('Error al obtener los estudios');
                        error();
                    }
                );
        
        };
        
        function verDetalle(idEstudio){
            show();
            EstudiosService.idEstudioSeleccionado=idEstudio;
            window.location.href='#/estudios/detalle';
        };
        
        
        function numberOfPages(){
            return Math.ceil(scope.listaEstudiosMostrar.length/scope.pageSize);  
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