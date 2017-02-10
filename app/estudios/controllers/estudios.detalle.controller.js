(function () { 
    'use strict';
	
    angular
	.module('app.estudios')
	.controller('EstudiosDetalleController', EstudiosDetalleController);
    
    function EstudiosDetalleController (
        VehiculoService, 
        FamiliaService, 
        EstudiosService, 
        HijoService, 
        PropiedadService,
        DependienteService, 
        MotivoService, 
        $localStorage, 
        $rootScope, 
        $state, 
        $mdDialog, 
        $mdToast, 
        DialogService, RestService, AuthenticationService, Constants, UserService) {
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
        scope.vehiculo={};
        scope.propiedad={};
        scope.listaEmpleado=[];
        scope.empleadoAsignado={};
        
        //Banderas
        scope.load=false;
        scope.verAccion=false;
        scope.banderaActualizar=false;
        
        /*papa-mama*/
        scope.guardarPapa=guardarPapa;
        scope.guardarMama=guardarMama;
        
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
        
        /*vehiculo*/
        scope.verActualizarVehiculo=verActualizarVehiculo;
        scope.eliminarVehiculo=eliminarVehiculo;
        scope.agregarVehiculo=agregarVehiculo;
        scope.guardarVehiculo=guardarVehiculo;
        
        /*propiedad*/
        scope.verActualizarPropiedad=verActualizarPropiedad;
        scope.eliminarPropiedad=eliminarPropiedad;
        scope.agregarPropiedad=agregarPropiedad;
        scope.guardarPropiedad=guardarPropiedad;
        
        /*asignacion*/
        scope.asignarShow=asignarShow;
        scope.asignarEmpleado=asignarEmpleado;
        
        /*ingresos*/
        scope.guardarIngresos=guardarIngresos;
        
        scope.ingresos={};
        scope.ingresos.ingreso_otros_miembros=0;
        scope.ingresos.ingreso_renta=0;
        scope.ingresos.ingreso_honorarios=0;
        scope.ingresos.ingreso_inversiones=0;
        scope.ingresos.ingreso_pensiones=0;
        scope.ingresos.ingreso_ventas=0;
        scope.ingresos.otros_ingresos=0;
        scope.ingresos.total_otros_ingresos=0;
        scope.ingresos.sueldo_papa=0;
        scope.ingresos.sueldo_mama=0;
        scope.ingresos.ingreso_percapita=0;
        scope.ingresos.clasificacion='';
        scope.calcula=calcula;
        scope.setSueldo=setSueldo;
        
        function setSueldo(){
            scope.ingresos.sueldo_papa=scope.estudio.sueldo_papa;
            scope.ingresos.sueldo_mama=scope.estudio.sueldo_mama;
        }
        
        function calcula(){
            var suma=0;
            
            suma+=scope.ingresos.ingreso_otros_miembros;
            suma+=scope.ingresos.ingreso_renta;
            suma+=scope.ingresos.ingreso_honorarios;
            suma+=scope.ingresos.ingreso_inversiones;
            suma+=scope.ingresos.ingreso_pensiones;
            suma+=scope.ingresos.ingreso_ventas;
            suma+=scope.ingresos.otros_ingresos;
            scope.ingresos.total_otros_ingresos=suma;
            
            scope.ingresos.total_ingresos=scope.ingresos.sueldo_papa+scope.ingresos.sueldo_mama+scope.ingresos.total_otros_ingresos;
            var n=scope.estudio.dependientes.length+scope.estudio.hijos.length;
            scope.ingresos.ingreso_percapita=scope.ingresos.total_ingresos/n;
            
            
            if(scope.ingresos.ingreso_percapita>15000){
                scope.ingresos.clasificacion='A';
            }
            if(scope.ingresos.ingreso_percapita>8000&&scope.ingresos.ingreso_percapita<14999){
                scope.ingresos.clasificacion='B';
            }
            if(scope.ingresos.ingreso_percapita<8000){
                scope.ingresos.clasificacion='C';
            }
            if(scope.ingresos.ingreso_percapita<8000){
                scope.ingresos.clasificacion='C-';
            }
            
        }
        
        if (!$localStorage.globals||!$rootScope.isAuth) {
            mensaje('error', 'Session', 'Tu session ha expirado.');
            location.href='#/login';
        }
        var id=0;
        if($rootScope.tipoUsuario==='2'){
            id=$rootScope.institucion.id_institucion;
        }
 
       EstudiosService.obtenerDetalleEstudio(EstudiosService.idEstudioSeleccionado, id).then(
            function(response){
                scope.estudio=response.data;
                
                scope.estudio.sueldo_papa=parseFloat(scope.estudio.sueldo_papa);
                scope.estudio.sueldo_mama=parseFloat(scope.estudio.sueldo_mama);
                scope.ingresos.sueldo_papa=scope.estudio.sueldo_papa;
                scope.ingresos.sueldo_mama=scope.estudio.sueldo_mama;
                
                scope.ingresos=response.data.ingresos[0];
                
                scope.ingresos.ingreso_otros_miembros=parseFloat(scope.ingresos.ingreso_otros_miembros);
                scope.ingresos.ingreso_renta=parseFloat(scope.ingresos.ingreso_renta);
                scope.ingresos.ingreso_honorarios=parseFloat(scope.ingresos.ingreso_inversiones);
                scope.ingresos.ingreso_inversiones=parseFloat(scope.ingresos.ingreso_inversiones);
                scope.ingresos.ingreso_pensiones=parseFloat(scope.ingresos.ingreso_pensiones);
                scope.ingresos.ingreso_ventas=parseFloat(scope.ingresos.ingreso_ventas);
                scope.ingresos.otros_ingresos=parseFloat(scope.ingresos.otros_ingresos);
                scope.ingresos.total_otros_ingresos=parseFloat(scope.ingresos.total_otros_ingresos);
                scope.ingresos.sueldo_papa=parseFloat(scope.ingresos.sueldo_papa);
                scope.ingresos.sueldo_mama=parseFloat(scope.ingresos.sueldo_mama);
                scope.ingresos.ingreso_percapita=parseFloat(scope.ingresos.ingreso_percapita);
                scope.ingresos.total_ingresos=parseFloat(scope.ingresos.total_ingresos);
                
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
            scope.hijo.id_estudio=scope.estudio.id_estudio;
            scope.hijo.folio_estudio=scope.estudio.folio_estudio;
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
            scope.dependiente.id_estudio=scope.estudio.id_estudio;
            scope.dependiente.folio_estudio=scope.estudio.folio_estudio;
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
            scope.motivo.id_estudio=scope.estudio.id_estudio;
            scope.motivo.folio_estudio=scope.estudio.folio_estudio;
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
       
       function guardarPapa (){
            var obj={};
            obj.id_familia=scope.estudio.id_familia;
            obj.nombre_papa=scope.estudio.nombre_papa;
            obj.apellido_paterno_papa=scope.estudio.apellido_paterno_papa;
            obj.apellido_materno_papa=scope.estudio.apellido_materno_papa;
            obj.edad_papa=scope.estudio.edad_papa;
            obj.correo_papa=scope.estudio.correo_papa;
            obj.rfc_papa=scope.estudio.rfc_papa;
            obj.celular_papa=scope.estudio.celular_papa;
            obj.profesion_papa=scope.estudio.profesion_papa;
            obj.ocupacion_papa=scope.estudio.ocupacion_papa;
            obj.empresa_papa=scope.estudio.empresa_papa;
            obj.puesto_papa=scope.estudio.puesto_papa;
            obj.giro_papa=scope.estudio.giro_papa;
            obj.dueno_papa=scope.estudio.dueno_papa;
            obj.antiguedad_papa=scope.estudio.antiguedad_papa;
            obj.sueldo_papa=scope.estudio.sueldo_papa;
            
            console.log(obj);
            confirmaMsj(
                "Confirmación de solicitud",
                "¿Guardar datos del papa?",
                "Si",
                    function(){
                        FamiliaService.actualizarFamilia(obj).then(
                            function(response){
                                mensaje('success', 'Aviso.', 'Se guardaron los datos del papa correctamente.');
                            },
                            function(error){
                                console.log('Error al guardar papa: '+error);
                            }
                        );
                    },
                "No",
                    function(){}
            );
        };
        
        function guardarMama (){
            var obj={};
            obj.id_familia=scope.estudio.id_familia;
            obj.nombre_mama=scope.estudio.nombre_mama;
            obj.apellido_paterno_mama=scope.estudio.apellido_paterno_mama;
            obj.apellido_materno_mama=scope.estudio.apellido_materno_mama;
            obj.edad_mama=scope.estudio.edad_mama;
            obj.correo_mama=scope.estudio.correo_mama;
            obj.rfc_mama=scope.estudio.rfc_mama;
            obj.celular_mama=scope.estudio.celular_mama;
            obj.profesion_mama=scope.estudio.profesion_mama;
            obj.ocupacion_mama=scope.estudio.ocupacion_mama;
            obj.empresa_mama=scope.estudio.empresa_mama;
            obj.puesto_mama=scope.estudio.puesto_mama;
            obj.giro_mama=scope.estudio.giro_mama;
            obj.dueno_mama=scope.estudio.dueno_mama;
            obj.antiguedad_mama=scope.estudio.antiguedad_mama;
            obj.sueldo_mama=scope.estudio.sueldo_mama;
            console.log(obj);
            confirmaMsj(
                "Confirmación de solicitud",
                "¿Guardar datos de la mama?",
                "Si",
                    function(){
                        FamiliaService.actualizarFamilia(obj).then(
                            function(response){
                                mensaje('success', 'Aviso.', 'Se guardaron los datos de la mama correctamente.');
                            },
                            function(error){
                                console.log('Error al guardar papa: '+error);
                            }
                        );
                    },
                "No",
                    function(){}
            );
        };
   
   
        /*vehiculos*/
        function verActualizarVehiculo(vehiculo){
            scope.banderaActualizar=true;
            scope.vehiculo=vehiculo;
            $("#modal_agregar_vehiculo").modal('show');
        }
        
        function agregarVehiculo(idFamilia){
            scope.vehiculo={};
            scope.banderaActualizar=false;
            scope.vehiculo.id_familia=idFamilia;
            $("#modal_agregar_vehiculo").modal('show');
        }
        
        function eliminarVehiculo(vehiculo){
            confirmaMsj("Confirmación de solicitud",
                "¿Eliminar vehiculo?",
                "Si",
                function(){
                    VehiculoService.eliminarVehiculo(vehiculo).then(
                        function(response){
                            scope.estudio.vehiculos=response.data;
                            mensaje('success', 'Aviso.', 'Se eliminó el vehiculo seleccionado correctamente.');
                            scope.vehiculo={};
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
        
        function guardarVehiculo(){
            console.log(scope.vehiculo);
            scope.vehiculo.id_estudio=scope.estudio.id_estudio;
            scope.vehiculo.folio_estudio=scope.estudio.folio_estudio;
            if(scope.banderaActualizar){
                confirmaMsj(
                    "Confirmación de solicitud",
                    "¿Actualizar datos?",
                    "Si",
                        function(){
                            VehiculoService.actualizarVehiculo(scope.vehiculo).then(
                                function(response){
                                    scope.estudio.vehiculos=response.data;
                                    mensaje('success', 'Aviso.', 'Se actualizaron los datos del vehiculo correctamente.');
                                    $("#modal_agregar_vehiculo").modal('hide');
                                    scope.vehiculo={};
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
                "¿Agregar vehiculo?",
                "Si",
                    function(){
                        VehiculoService.guardarVehiculo(scope.vehiculo).then(
                            function(response){
                                scope.estudio.vehiculos=response.data;
                                mensaje('success', 'Aviso.', 'Se guardo el vehiculo correctamente.');
                                $("#modal_agregar_vehiculo").modal('hide');
                                scope.vehiculo={};
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
        
        /*propiedad*/
        function verActualizarPropiedad(propiedad){
            scope.banderaActualizar=true;
            scope.propiedad=propiedad;
            $("#modal_agregar_propiedad").modal('show');
        }
        
        function agregarPropiedad(idFamilia){
            scope.propiedad={};
            scope.banderaActualizar=false;
            scope.propiedad.id_familia=idFamilia;
            $("#modal_agregar_propiedad").modal('show');
        }
        
        function eliminarPropiedad(propiedad){
            confirmaMsj("Confirmación de solicitud",
                "¿Eliminar propiedad?",
                "Si",
                function(){
                    PropiedadService.eliminarPropiedad(propiedad).then(
                        function(response){
                            scope.estudio.propiedades=response.data;
                            mensaje('success', 'Aviso.', 'Se eliminó el propiedad seleccionado correctamente.');
                            scope.propiedad={};
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
        
        function guardarPropiedad(){
            console.log(scope.propiedad);
            scope.propiedad.id_estudio=scope.estudio.id_estudio;
            scope.propiedad.folio_estudio=scope.estudio.folio_estudio;
            if(scope.banderaActualizar){
                confirmaMsj(
                    "Confirmación de solicitud",
                    "¿Actualizar datos?",
                    "Si",
                        function(){
                            PropiedadService.actualizarPropiedad(scope.propiedad).then(
                                function(response){
                                    scope.estudio.propiedades=response.data;
                                    mensaje('success', 'Aviso.', 'Se actualizaron los datos del propiedad correctamente.');
                                    $("#modal_agregar_propiedad").modal('hide');
                                    scope.propiedad={};
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
                "¿Agregar propiedad?",
                "Si",
                    function(){
                        PropiedadService.guardarPropiedad(scope.propiedad).then(
                            function(response){
                                scope.estudio.propiedades=response.data;
                                mensaje('success', 'Aviso.', 'Se guardo el propiedad correctamente.');
                                $("#modal_agregar_propiedad").modal('hide');
                                scope.propiedad={};
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
        
        function guardarIngresos(){
            console.log(scope.ingresos);
            scope.ingresos.id_estudio=scope.estudio.id_estudio;
            scope.ingresos.folio_estudio=scope.estudio.folio_estudio;
            scope.ingresos.id_familia=scope.estudio.id_familia;
            confirmaMsj(
                "Confirmación de solicitud",
                "¿Actualizar datos?",
                "Si",
                    function(){
                        if(scope.ingresos.id_ingreso_familia!==undefined){
                            FamiliaService.actualizarIngresos(scope.ingresos).then(
                                function(response){
                                    scope.ingresos=response.data[0];
                                    scope.ingresos.ingreso_otros_miembros=parseFloat(scope.ingresos.ingreso_otros_miembros);
                                    scope.ingresos.ingreso_renta=parseFloat(scope.ingresos.ingreso_renta);
                                    scope.ingresos.ingreso_honorarios=parseFloat(scope.ingresos.ingreso_inversiones);
                                    scope.ingresos.ingreso_inversiones=parseFloat(scope.ingresos.ingreso_inversiones);
                                    scope.ingresos.ingreso_pensiones=parseFloat(scope.ingresos.ingreso_pensiones);
                                    scope.ingresos.ingreso_ventas=parseFloat(scope.ingresos.ingreso_ventas);
                                    scope.ingresos.otros_ingresos=parseFloat(scope.ingresos.otros_ingresos);
                                    scope.ingresos.total_otros_ingresos=parseFloat(scope.ingresos.total_otros_ingresos);
                                    scope.ingresos.sueldo_papa=parseFloat(scope.ingresos.sueldo_papa);
                                    scope.ingresos.sueldo_mama=parseFloat(scope.ingresos.sueldo_mama);
                                    scope.ingresos.ingreso_percapita=parseFloat(scope.ingresos.ingreso_percapita);
                                    scope.ingresos.total_ingresos=parseFloat(scope.ingresos.total_ingresos);

                                    mensaje('success', 'Aviso.', 'Se actualizaron los datos de los ingresos correctamente.');

                                },
                                function(error){
                                    console.log('Error al guardar hijo: '+error);
                                }
                            );
                        }else{
                            FamiliaService.guardarIngresos(scope.ingresos).then(
                                function(response){
                                    scope.ingresos=response.data[0];
                                    scope.ingresos.ingreso_otros_miembros=parseFloat(scope.ingresos.ingreso_otros_miembros);
                                    scope.ingresos.ingreso_renta=parseFloat(scope.ingresos.ingreso_renta);
                                    scope.ingresos.ingreso_honorarios=parseFloat(scope.ingresos.ingreso_inversiones);
                                    scope.ingresos.ingreso_inversiones=parseFloat(scope.ingresos.ingreso_inversiones);
                                    scope.ingresos.ingreso_pensiones=parseFloat(scope.ingresos.ingreso_pensiones);
                                    scope.ingresos.ingreso_ventas=parseFloat(scope.ingresos.ingreso_ventas);
                                    scope.ingresos.otros_ingresos=parseFloat(scope.ingresos.otros_ingresos);
                                    scope.ingresos.total_otros_ingresos=parseFloat(scope.ingresos.total_otros_ingresos);
                                    scope.ingresos.sueldo_papa=parseFloat(scope.ingresos.sueldo_papa);
                                    scope.ingresos.sueldo_mama=parseFloat(scope.ingresos.sueldo_mama);
                                    scope.ingresos.ingreso_percapita=parseFloat(scope.ingresos.ingreso_percapita);
                                    scope.ingresos.total_ingresos=parseFloat(scope.ingresos.total_ingresos);

                                    mensaje('success', 'Aviso.', 'Se guardaron los datos de los ingresos correctamente.');

                                },
                                function(error){
                                    console.log('Error al guardar hijo: '+error);
                                }
                            );
                        }
                        
                    },
                "No",
                    function(){}
            );
            
        }
        
    };//end controller

})();