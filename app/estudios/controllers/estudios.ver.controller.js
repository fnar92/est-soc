(function () { 
    'use strict';
	
    angular
	.module('app.estudios')
	.controller('EstudiosVerController', EstudiosVerController);
    
    function EstudiosVerController (EstudiosService, $localStorage, $rootScope, $state, $mdDialog, $mdToast, DialogService, RestService, AuthenticationService, Constants, UserService) {
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
            $("#modal_agendar_entrevista").modal('show');
        }

        function agendarSave(){
            var obj={};
            obj.id_estudio=scope.estudio.id_estudio;
            obj.id_estatus_estudio=3;
            obj.fecha_entrevista=scope.entrevista.fecha_entrevista;
            obj.comentarios=scope.entrevista.comentarios;
            console.log(obj);
            confirmaMsj(
                "Confirmación de solicitud",
                "¿Agendar estudio?",
                "Si",
                    function(){
                        EstudiosService.actualizarEstudio(obj).then(
                            function(response){
                                scope.familia={};
                                scope.estudio={};
                                mensaje('success', 'Aviso.', 'Se agendo el estudio correctamente.');
                                scope.buscarEstudios();
                                $("#modal_agendar_entrevista").modal('hide');
                                $("#modal_agendar").modal('hide');
                            },
                            function(error){
                                console.log('Error al guardar hijo: '+error);
                            }
                        );
                    },
                "No",
                    function(){}
            );
        }
        function reagendarEstudio(){
            var obj={};
            obj.id_estudio=scope.estudio.id_estudio;
            obj.id_estatus_estudio=4;
            
            console.log(obj);
            
            confirmaMsj(
                "Confirmación de solicitud",
                "¿Reagendar estudio?",
                "Si",
                    function(){
                        EstudiosService.actualizarEstudio(obj).then(
                            function(response){
                                scope.familia={};
                                scope.estudio={};
                                mensaje('success', 'Aviso.', 'Se reagendo el estudio correctamente.');
                                scope.buscarEstudios();
                                $("#modal_agendar").modal('hide');
                            },
                            function(error){
                                console.log('Error al guardar hijo: '+error);
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
        
       
   
        
    };//end controller

})();