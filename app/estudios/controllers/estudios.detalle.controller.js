(function () { 
    'use strict';
	
    angular
	.module('app.estudios')
	.controller('EstudiosDetalleController', EstudiosDetalleController);
    
    function EstudiosDetalleController (EstudiosService, HijoService, DependienteService, MotivoService, $localStorage, $rootScope, $state, $mdDialog, $mdToast, DialogService, RestService, AuthenticationService, Constants, UserService) {
        /* jshint validthis: true */
        console.log('init estudios ver detalle');
        
        //Check session
        AuthenticationService.isAuth();
        
        var scope = this;  
        
        if(EstudiosService.idEstudioSeleccionado===0){
            error();
        }
        scope.estudio={};
        scope.hijo={};
        scope.dependiente={};
        scope.motivo={};
        scope.listaEmpleado=[];
        scope.empleadoAsignado={};
        
        //Banderas
        scope.load=false;
        scope.verAccion=false;
        scope.banderaActualizar=false;
        
        /*hijo*/
        scope.verActualizarHijo=verActualizarHijo;
        scope.eliminarHijo=eliminarHijo;
        scope.agregarHijo=agregarHijo;
        scope.guardarHijo=guardarHijo;
        /*dependiente*/
        scope.verActualizarDependiente=verActualizarDependiente;
        scope.eliminarDependiente=eliminarDependiente;
        scope.agregarDependiente=agregarDependiente;
        scope.guardarDependiente=guardarDependiente;
        /*motivo*/
        scope.verActualizarMotivo=verActualizarMotivo;
        scope.eliminarMotivo=eliminarMotivo;
        scope.agregarMotivo=agregarMotivo;
        scope.guardarMotivo=guardarMotivo;
        
        /*asignacion*/
        scope.asignarShow=asignarShow;
        scope.asignarEmpleado=asignarEmpleado;
        
        if (!$localStorage.globals||!$rootScope.isAuth) {
            mensaje('error', 'Session', 'Tu session ha expirado.');
            location.href='#/login';
        }
 
       EstudiosService.obtenerDetalleEstudio(EstudiosService.idEstudioSeleccionado).then(
            function(response){
                scope.estudio=response.data;
                EstudiosService.obtenerEmpleados().then(
                    function(response){
                        scope.listaEmpleado=response.data;
                        hide();
                    },
                    function(error){
                        console.log('Error al obtener empleados: '+error);
                    }
                );
            },
            function(error){
                console.log('Error al obtener el detalle: '+error);
            }
        );

        function verActualizarHijo(hijo){
            scope.banderaActualizar=true;
            scope.hijo=hijo;
            console.log("fecha: "+scope.hijo.fecha_nacimiento);
            $("#modal_agregar_hijo").modal('show');
        }
        
        function agregarHijo(idFamilia){
            scope.hijo={};
            scope.banderaActualizar=false;
            scope.hijo.id_familia=idFamilia;
            $("#modal_agregar_hijo").modal('show');
        }
        
        function eliminarHijo(hijo){
            confirmaMsj("Confirmación de solicitud",
                "¿Eliminar hijo?",
                "Si",
                function(){
                    HijoService.eliminarHijo(hijo).then(
                        function(response){
                            scope.estudio.hijos=response.data;
                            mensaje('success', 'Aviso.', 'Se eliminó al hijo seleccionado correctamente.');
                            scope.hijo={};
                            scope.banderaActualizar=false;
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
        
        function guardarHijo(){
            console.log(scope.hijo);
            if(scope.banderaActualizar){
                confirmaMsj(
                    "Confirmación de solicitud",
                    "¿Actualizar datos?",
                    "Si",
                        function(){
                            HijoService.actualizarHijo(scope.hijo).then(
                                function(response){
                                    scope.estudio.hijos=response.data;
                                    mensaje('success', 'Aviso.', 'Se actualizaron los datos del hijo correctamente.');
                                    $("#modal_agregar_hijo").modal('hide');
                                    scope.hijo={};
                                    scope.banderaActualizar=false;
                                },
                                function(error){
                                    console.log('Error al guardar hijo: '+error);
                                }
                            );
                        },
                    "No",
                        function(){}
                );
                return;
            }
            confirmaMsj(
                "Confirmación de solicitud",
                "¿Agregar hijo?",
                "Si",
                    function(){
                        HijoService.guardarHijo(scope.hijo).then(
                            function(response){
                                scope.estudio.hijos=response.data;
                                mensaje('success', 'Aviso.', 'Se guardo al hijo correctamente.');
                                $("#modal_agregar_hijo").modal('hide');
                                scope.hijo={};
                                scope.banderaActualizar=false;
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
        
        /*Dependiente*/
        function verActualizarDependiente(dependiente){
            scope.banderaActualizar=true;
            scope.dependiente=dependiente;
            console.log("fecha: "+scope.dependiente.fecha_nacimiento);
            $("#modal_agregar_dependiente").modal('show');
        }
        
        function agregarDependiente(idFamilia){
            scope.dependiente={};
            scope.banderaActualizar=false;
            scope.dependiente.id_familia=idFamilia;
            $("#modal_agregar_dependiente").modal('show');
        }
        
        function eliminarDependiente(dependiente){
            confirmaMsj("Confirmación de solicitud",
                "¿Eliminar dependiente?",
                "Si",
                function(){
                    DependienteService.eliminarDependiente(dependiente).then(
                        function(response){
                            scope.estudio.dependientes=response.data;
                            mensaje('success', 'Aviso.', 'Se eliminó al dependiente seleccionado correctamente.');
                            scope.dependiente={};
                            scope.banderaActualizar=false;
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
        
        function guardarDependiente(){
            console.log(scope.dependiente);
            if(scope.banderaActualizar){
                confirmaMsj(
                    "Confirmación de solicitud",
                    "¿Actualizar datos?",
                    "Si",
                        function(){
                            DependienteService.actualizarDependiente(scope.dependiente).then(
                                function(response){
                                    scope.estudio.dependientes=response.data;
                                    mensaje('success', 'Aviso.', 'Se actualizaron los datos del dependiente correctamente.');
                                    $("#modal_agregar_dependiente").modal('hide');
                                    scope.dependiente={};
                                    scope.banderaActualizar=false;
                                },
                                function(error){
                                    console.log('Error al guardar hijo: '+error);
                                }
                            );
                        },
                    "No",
                        function(){}
                );
                return;
            }
            confirmaMsj(
                "Confirmación de solicitud",
                "¿Agregar dependiente?",
                "Si",
                    function(){
                        DependienteService.guardarDependiente(scope.dependiente).then(
                            function(response){
                                scope.estudio.dependientes=response.data;
                                mensaje('success', 'Aviso.', 'Se guardo al dependiente correctamente.');
                                $("#modal_agregar_dependiente").modal('hide');
                                scope.dependiente={};
                                scope.banderaActualizar=false;
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
        
         /*motivo*/
        function verActualizarMotivo(motivo){
            scope.banderaActualizar=true;
            scope.motivo=motivo;
            $("#modal_agregar_motivo").modal('show');
        }
        
        function agregarMotivo(idFamilia){
            scope.motivo={};
            scope.banderaActualizar=false;
            scope.motivo.id_familia=idFamilia;
            $("#modal_agregar_motivo").modal('show');
        }
        
        function eliminarMotivo(motivo){
            confirmaMsj("Confirmación de solicitud",
                "¿Eliminar motivo?",
                "Si",
                function(){
                    MotivoService.eliminarMotivo(motivo).then(
                        function(response){
                            scope.estudio.motivos=response.data;
                            mensaje('success', 'Aviso.', 'Se eliminó el motivo seleccionado correctamente.');
                            scope.motivo={};
                            scope.banderaActualizar=false;
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
        
        function guardarMotivo(){
            console.log(scope.motivo);
            if(scope.banderaActualizar){
                confirmaMsj(
                    "Confirmación de solicitud",
                    "¿Actualizar datos?",
                    "Si",
                        function(){
                            MotivoService.actualizarMotivo(scope.motivo).then(
                                function(response){
                                    scope.estudio.dependientes=response.data;
                                    mensaje('success', 'Aviso.', 'Se actualizaron los datos del motivo correctamente.');
                                    $("#modal_agregar_motivo").modal('hide');
                                    scope.motivo={};
                                    scope.banderaActualizar=false;
                                },
                                function(error){
                                    console.log('Error al guardar hijo: '+error);
                                }
                            );
                        },
                    "No",
                        function(){}
                );
                return;
            }
            confirmaMsj(
                "Confirmación de solicitud",
                "¿Agregar motivo?",
                "Si",
                    function(){
                        MotivoService.guardarMotivo(scope.motivo).then(
                            function(response){
                                scope.estudio.motivos=response.data;
                                mensaje('success', 'Aviso.', 'Se guardo el motivo correctamente.');
                                $("#modal_agregar_motivo").modal('hide');
                                scope.dependiente={};
                                scope.banderaActualizar=false;
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
       
        function asignarShow (){
            scope.empleadoAsignado.id_usuario_asignado=scope.estudio.id_usuario_asignado;
            $("#modal_asignar").modal('show');
        };
        
        function asignarEmpleado (){
            scope.empleadoAsignado.id_estudio=scope.estudio.id_estudio;
            scope.empleadoAsignado.id_usuario_asigno=$localStorage.globals.id;
            scope.empleadoAsignado.id_estatus_estudio=2;
            console.log(scope.empleadoAsignado);
            confirmaMsj(
                "Confirmación de solicitud",
                "¿Asignar estudio al usuario seleccionado?",
                "Si",
                    function(){
                        EstudiosService.guardarAsignado(scope.empleadoAsignado).then(
                            function(response){
                                scope.estudio.id_usuario_asignado=scope.empleadoAsignado.id_usuario_asignado;
                                scope.estudio.id_estatus_estudio=scope.empleadoAsignado.id_estatus_estudio;
                                mensaje('success', 'Aviso.', 'Se asigno el estudio al usuario correctamente.');
                                $("#modal_asignar").modal('hide');
                                scope.empleadoAsignado={};
                            },
                            function(error){
                                console.log('Error al guardar hijo: '+error);
                            }
                        );
                    },
                "No",
                    function(){}
            );
        };
       
   
        
    };//end controller

})();