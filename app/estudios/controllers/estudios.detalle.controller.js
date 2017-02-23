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
        ComentarioService,
        $localStorage, 
        $rootScope, 
        $state, 
        $mdDialog, 
        $mdToast, 
        DialogService, RestService, AuthenticationService, Constants, UserService, $q) {
        /* jshint validthis: true */
        console.log('init estudios ver detalle');
        
        //Check session
        AuthenticationService.isAuth();
        
        var scope = this;  
        
        if(EstudiosService.idEstudioSeleccionado===0){
            error();
        }
        if (!$localStorage.globals||!$rootScope.isAuth) {
            mensaje('error', 'Session', 'Tu session ha expirado.');
            location.href='#/login';
        }
        
        scope.estudio={};
        scope.hijo={};
        scope.dependiente={};
        scope.motivo={};
        scope.vehiculo={};
        scope.propiedad={};
        scope.comentario={};
        scope.listaEmpleado=[];
        scope.empleadoAsignado={};
        scope.ingresos={};
        scope.egresos={};
        scope.documentos={};
        scope.evaluacion={};
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
        
        /*Egresos*/
        scope.guardarEgresos=guardarEgresos;
        
        /*Docs*/
        scope.guardarDocumentos=guardarDocumentos;
        
        /*Evaluacion*/
        scope.guardarEvaluacion=guardarEvaluacion;
        
        /*Comentarios*/
        scope.verActualizarComentario=verActualizarComentario;
        scope.eliminarComentario=eliminarComentario;
        scope.agregarComentario=agregarComentario;
        scope.guardarComentario=guardarComentario;
        scope.calcula=calcula;
        scope.setSueldo=setSueldo;
        
        /*cambia estatus estudio*/
        scope.finalizarCaptura=finalizarCaptura;
        scope.enviarARevision=enviarARevision;
        scope.enviarATerminado=enviarATerminado;
        
        scope.calculaEgresos=calculaEgresos;
        scope.calculaEgresosServicios=calculaEgresosServicios;
        scope.calculaEgresosTotal=calculaEgresosTotal;
        
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
        
        scope.egresos.alimentacion_despensa=0;
        scope.egresos.renta=0;
        scope.egresos.credito_hipotecario=0;
        scope.egresos.colegiaturas=0;
        scope.egresos.otras_colegiaturas=0;
        scope.egresos.clases_particulares=0;
        scope.egresos.agua=0;
        scope.egresos.luz=0;
        scope.egresos.telefono=0;
        scope.egresos.servicio_domestico=0;
        scope.egresos.gas=0;
        scope.egresos.total_servicios=0;
        scope.egresos.gasolina=0;
        scope.egresos.credito_auto=0;
        scope.egresos.pago_tdc_mensual=0;
        scope.egresos.saldo_tdc=0;
        scope.egresos.creditos_comerciales=0;
        scope.egresos.vestido_calzado=0;
        scope.egresos.medico_medicinas=0;
        scope.egresos.diversion_entretenimiento=0;
        scope.egresos.clubes_deportivos=0;
        scope.egresos.seguros=0;
        scope.egresos.vacaciones=0;
        scope.egresos.otros=0;
        scope.egresos.otros2=0;
        scope.egresos.total_egresos=0;
        scope.egresos.diferencia_egre_ingre=0;
        
        var id=0;
        if($rootScope.tipoUsuario==='2'){
            id=$rootScope.institucion.id_institucion;
        }
        load();
        
        function enviarATerminado(){
            var obj={};
            obj.id_estudio=scope.estudio.id_estudio;
            obj.id_estatus_estudio=7;
            confirmaMsj(
                "Confirmación de solicitud",
                "¿Terminar estudio? Será visible para la institución.",
                "Si",
                    function(){
                        show();
                        var promesas=[];
                        promesas.push(EstudiosService.actualizarEstudio(obj));
                        $q.all(promesas).then(
                            function(response){
                                load();
                            }
                        );
                    },
                "No",
                    function(){}
            );
        }
        function finalizarCaptura(){
            var obj={};
            obj.id_estudio=scope.estudio.id_estudio;
            obj.id_estatus_estudio=5;
            confirmaMsj(
                "Confirmación de solicitud",
                "¿Terminar captura?",
                "Si",
                    function(){
                        show();
                        var promesas=[];
                        promesas.push(EstudiosService.actualizarEstudio(obj));
                        $q.all(promesas).then(
                            function(response){
                                load();
                            }
                        );
                    },
                "No",
                    function(){}
            );
        }
        
        function enviarARevision(){
            var obj={};
            obj.id_estudio=scope.estudio.id_estudio;
            obj.id_estatus_estudio=6;
            if($rootScope.isLocal){
                obj.sync=1;
            }
            confirmaMsj(
                "Confirmación de solicitud",
                "¿Enviar estudio a revisión?",
                "Si",
                    function(){
                        show();
                        var promesas=[];
                        promesas.push(EstudiosService.actualizarEstudio(obj));
                        $q.all(promesas).then(
                            function(response){
                                load();
                            }
                        );
                    },
                "No",
                    function(){}
            );
        }
        
        function load(){
            EstudiosService.obtenerDetalleEstudio(EstudiosService.idEstudioSeleccionado, id).then(
                function(response){
                    scope.estudio=response.data;

                    if(response.data.evaluacion.length>0){
                        scope.evaluacion=scope.estudio.evaluacion[0];
                    }

                    if(response.data.documentos.length>0){
                        scope.documentos=scope.estudio.documentos[0];
                    }

                    if(scope.estudio.padres.length>0){

                        for(var i=0; i<scope.estudio.padres.length; i++){
                            if(scope.estudio.padres[i].tipo_persona==='PAPA'){
                                scope.estudio.id_papa=scope.estudio.padres[i].id_padre_familia;
                                scope.estudio.nombre_papa=scope.estudio.padres[i].nombre;
                                scope.estudio.apellido_paterno_papa=scope.estudio.padres[i].apellido_paterno;
                                scope.estudio.apellido_materno_papa=scope.estudio.padres[i].apellido_materno;
                                scope.estudio.edad_papa=scope.estudio.padres[i].edad;
                                scope.estudio.correo_papa=scope.estudio.padres[i].correo;
                                scope.estudio.rfc_papa=scope.estudio.padres[i].rfc;
                                scope.estudio.celular_papa=scope.estudio.padres[i].celular;
                                scope.estudio.profesion_papa=scope.estudio.padres[i].profesion;
                                scope.estudio.ocupacion_papa=scope.estudio.padres[i].ocupacion;
                                scope.estudio.empresa_papa=scope.estudio.padres[i].empresa;
                                scope.estudio.puesto_papa=scope.estudio.padres[i].puesto;
                                scope.estudio.giro_papa=scope.estudio.padres[i].giro;
                                scope.estudio.dueno_papa=scope.estudio.padres[i].dueno;
                                scope.estudio.antiguedad_papa=scope.estudio.padres[i].antiguedad;
                                scope.estudio.sueldo_papa=scope.estudio.padres[i].sueldo_neto;
                            }
                            if(scope.estudio.padres[i].tipo_persona==='MAMA'){
                                scope.estudio.id_mama=scope.estudio.padres[i].id_padre_familia;
                                scope.estudio.nombre_mama=scope.estudio.padres[i].nombre;
                                scope.estudio.apellido_paterno_mama=scope.estudio.padres[i].apellido_paterno;
                                scope.estudio.apellido_materno_mama=scope.estudio.padres[i].apellido_materno;
                                scope.estudio.edad_mama=scope.estudio.padres[i].edad;
                                scope.estudio.correo_mama=scope.estudio.padres[i].correo;
                                scope.estudio.rfc_mama=scope.estudio.padres[i].rfc;
                                scope.estudio.celular_mama=scope.estudio.padres[i].celular;
                                scope.estudio.profesion_mama=scope.estudio.padres[i].profesion;
                                scope.estudio.ocupacion_mama=scope.estudio.padres[i].ocupacion;
                                scope.estudio.empresa_mama=scope.estudio.padres[i].empresa;
                                scope.estudio.puesto_mama=scope.estudio.padres[i].puesto;
                                scope.estudio.giro_mama=scope.estudio.padres[i].giro;
                                scope.estudio.dueno_mama=scope.estudio.padres[i].dueno;
                                scope.estudio.antiguedad_mama=scope.estudio.padres[i].antiguedad;
                                scope.estudio.sueldo_mama=scope.estudio.padres[i].sueldo_neto;
                            }
                        }

                    }


                    scope.estudio.sueldo_papa=parseFloat(scope.estudio.sueldo_papa);
                    scope.estudio.sueldo_mama=parseFloat(scope.estudio.sueldo_mama);
                    scope.ingresos.sueldo_papa=scope.estudio.sueldo_papa;
                    scope.ingresos.sueldo_mama=scope.estudio.sueldo_mama;



                    if(response.data.ingresos.length>0){
                        scope.ingresos=response.data.ingresos[0];
                        parseIngresos();
                        calcula();
                    }

                    if(response.data.egresos.length>0){
                        scope.egresos=response.data.egresos[0];
                        parseEgresos();
                    }
                    if(response.data.documentos.length>0){
                        setBool();		
                    }
                    calculaEgresos();
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
        }//end load

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
                            scope.calculaEgresos();
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
                                    scope.calculaEgresos();
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
                                scope.calculaEgresos();
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
            if(scope.estudio.id_papa!==undefined){
                var obj={};
                obj.id_padre_familia=scope.estudio.id_papa;
                obj.id_familia=scope.estudio.id_familia;
                obj.id_estudio=scope.estudio.id_estudio;
                obj.nombre=scope.estudio.nombre_papa;
                obj.apellido_paterno=scope.estudio.apellido_paterno_papa;
                obj.apellido_materno=scope.estudio.apellido_materno_papa;
                obj.edad=scope.estudio.edad_papa;
                obj.correo=scope.estudio.correo_papa;
                obj.rfc=scope.estudio.rfc_papa;
                obj.celular=scope.estudio.celular_papa;
                obj.profesion=scope.estudio.profesion_papa;
                obj.ocupacion=scope.estudio.ocupacion_papa;
                obj.empresa=scope.estudio.empresa_papa;
                obj.puesto=scope.estudio.puesto_papa;
                obj.giro=scope.estudio.giro_papa;
                obj.dueno=scope.estudio.dueno_papa;
                obj.antiguedad=scope.estudio.antiguedad_papa;
                obj.sueldo_neto=scope.estudio.sueldo_papa;

                console.log(obj);
                confirmaMsj(
                    "Confirmación de solicitud",
                    "¿Actualizar datos del papa?",
                    "Si",
                        function(){
                            FamiliaService.actualizarPapa(obj).then(
                                function(response){
                                    scope.estudio.padres=response.data;
                                    for(var i=0; i<scope.estudio.padres.length; i++){
                                        if(scope.estudio.padres[i].tipo_persona==='PAPA'){
                                            scope.estudio.id_papa=scope.estudio.padres[i].id_padre_familia;
                                            scope.estudio.nombre_papa=scope.estudio.padres[i].nombre;
                                            scope.estudio.apellido_paterno_papa=scope.estudio.padres[i].apellido_paterno;
                                            scope.estudio.apellido_materno_papa=scope.estudio.padres[i].apellido_materno;
                                            scope.estudio.edad_papa=scope.estudio.padres[i].edad;
                                            scope.estudio.correo_papa=scope.estudio.padres[i].correo;
                                            scope.estudio.rfc_papa=scope.estudio.padres[i].rfc;
                                            scope.estudio.celular_papa=scope.estudio.padres[i].celular;
                                            scope.estudio.profesion_papa=scope.estudio.padres[i].profesion;
                                            scope.estudio.ocupacion_papa=scope.estudio.padres[i].ocupacion;
                                            scope.estudio.empresa_papa=scope.estudio.padres[i].empresa;
                                            scope.estudio.puesto_papa=scope.estudio.padres[i].puesto;
                                            scope.estudio.giro_papa=scope.estudio.padres[i].giro;
                                            scope.estudio.dueno_papa=scope.estudio.padres[i].dueno;
                                            scope.estudio.antiguedad_papa=scope.estudio.padres[i].antiguedad;
                                            scope.estudio.sueldo_papa=scope.estudio.padres[i].sueldo_neto;
                                        }
                                        if(scope.estudio.padres[i].tipo_persona==='MAMA'){
                                            scope.estudio.id_mama=scope.estudio.padres[i].id_padre_familia;
                                            scope.estudio.nombre_mama=scope.estudio.padres[i].nombre;
                                            scope.estudio.apellido_paterno_mama=scope.estudio.padres[i].apellido_paterno;
                                            scope.estudio.apellido_materno_mama=scope.estudio.padres[i].apellido_materno;
                                            scope.estudio.edad_mama=scope.estudio.padres[i].edad;
                                            scope.estudio.correo_mama=scope.estudio.padres[i].correo;
                                            scope.estudio.rfc_mama=scope.estudio.padres[i].rfc;
                                            scope.estudio.celular_mama=scope.estudio.padres[i].celular;
                                            scope.estudio.profesion_mama=scope.estudio.padres[i].profesion;
                                            scope.estudio.ocupacion_mama=scope.estudio.padres[i].ocupacion;
                                            scope.estudio.empresa_mama=scope.estudio.padres[i].empresa;
                                            scope.estudio.puesto_mama=scope.estudio.padres[i].puesto;
                                            scope.estudio.giro_mama=scope.estudio.padres[i].giro;
                                            scope.estudio.dueno_mama=scope.estudio.padres[i].dueno;
                                            scope.estudio.antiguedad_mama=scope.estudio.padres[i].antiguedad;
                                            scope.estudio.sueldo_mama=scope.estudio.padres[i].sueldo_neto;
                                        }
                                    }
                                    scope.estudio.sueldo_papa=parseFloat(scope.estudio.sueldo_papa);
                                    scope.estudio.sueldo_mama=parseFloat(scope.estudio.sueldo_mama);
                                    scope.ingresos.sueldo_papa=scope.estudio.sueldo_papa;
                                    scope.ingresos.sueldo_mama=scope.estudio.sueldo_mama;
                                    calcula();
                                    calculaEgresos();
                                    mensaje('success', 'Aviso.', 'Se actualizaron los datos del papa correctamente.');
                                },
                                function(error){
                                    console.log('Error al guardar papa: '+error);
                                }
                            );
                        },
                    "No",
                        function(){}
                );
           }else{
                var obj={};
                obj.id_familia=scope.estudio.id_familia;
                obj.id_estudio=scope.estudio.id_estudio;
                obj.nombre=scope.estudio.nombre_papa;
                obj.apellido_paterno=scope.estudio.apellido_paterno_papa;
                obj.apellido_materno=scope.estudio.apellido_materno_papa;
                obj.edad=scope.estudio.edad_papa;
                obj.correo=scope.estudio.correo_papa;
                obj.rfc=scope.estudio.rfc_papa;
                obj.celular=scope.estudio.celular_papa;
                obj.profesion=scope.estudio.profesion_papa;
                obj.ocupacion=scope.estudio.ocupacion_papa;
                obj.empresa=scope.estudio.empresa_papa;
                obj.puesto=scope.estudio.puesto_papa;
                obj.giro=scope.estudio.giro_papa;
                obj.dueno=scope.estudio.dueno_papa;
                obj.antiguedad=scope.estudio.antiguedad_papa;
                obj.sueldo_neto=scope.estudio.sueldo_papa;
                obj.tipo_persona='PAPA';
                console.log(obj);
                confirmaMsj(
                    "Confirmación de solicitud",
                    "¿Guardar datos del papa?",
                    "Si",
                        function(){
                            FamiliaService.guardarPapa(obj).then(
                                function(response){
                                    scope.estudio.padres=response.data;
                                    for(var i=0; i<scope.estudio.padres.length; i++){
                                        if(scope.estudio.padres[i].tipo_persona==='PAPA'){
                                            scope.estudio.id_papa=scope.estudio.padres[i].id_padre_familia;
                                            scope.estudio.nombre_papa=scope.estudio.padres[i].nombre;
                                            scope.estudio.apellido_paterno_papa=scope.estudio.padres[i].apellido_paterno;
                                            scope.estudio.apellido_materno_papa=scope.estudio.padres[i].apellido_materno;
                                            scope.estudio.edad_papa=scope.estudio.padres[i].edad;
                                            scope.estudio.correo_papa=scope.estudio.padres[i].correo;
                                            scope.estudio.rfc_papa=scope.estudio.padres[i].rfc;
                                            scope.estudio.celular_papa=scope.estudio.padres[i].celular;
                                            scope.estudio.profesion_papa=scope.estudio.padres[i].profesion;
                                            scope.estudio.ocupacion_papa=scope.estudio.padres[i].ocupacion;
                                            scope.estudio.empresa_papa=scope.estudio.padres[i].empresa;
                                            scope.estudio.puesto_papa=scope.estudio.padres[i].puesto;
                                            scope.estudio.giro_papa=scope.estudio.padres[i].giro;
                                            scope.estudio.dueno_papa=scope.estudio.padres[i].dueno;
                                            scope.estudio.antiguedad_papa=scope.estudio.padres[i].antiguedad;
                                            scope.estudio.sueldo_papa=scope.estudio.padres[i].sueldo_neto;
                                        }
                                        if(scope.estudio.padres[i].tipo_persona==='MAMA'){
                                            scope.estudio.id_mama=scope.estudio.padres[i].id_padre_familia;
                                            scope.estudio.nombre_mama=scope.estudio.padres[i].nombre;
                                            scope.estudio.apellido_paterno_mama=scope.estudio.padres[i].apellido_paterno;
                                            scope.estudio.apellido_materno_mama=scope.estudio.padres[i].apellido_materno;
                                            scope.estudio.edad_mama=scope.estudio.padres[i].edad;
                                            scope.estudio.correo_mama=scope.estudio.padres[i].correo;
                                            scope.estudio.rfc_mama=scope.estudio.padres[i].rfc;
                                            scope.estudio.celular_mama=scope.estudio.padres[i].celular;
                                            scope.estudio.profesion_mama=scope.estudio.padres[i].profesion;
                                            scope.estudio.ocupacion_mama=scope.estudio.padres[i].ocupacion;
                                            scope.estudio.empresa_mama=scope.estudio.padres[i].empresa;
                                            scope.estudio.puesto_mama=scope.estudio.padres[i].puesto;
                                            scope.estudio.giro_mama=scope.estudio.padres[i].giro;
                                            scope.estudio.dueno_mama=scope.estudio.padres[i].dueno;
                                            scope.estudio.antiguedad_mama=scope.estudio.padres[i].antiguedad;
                                            scope.estudio.sueldo_mama=scope.estudio.padres[i].sueldo_neto;
                                        }
                                    }
                                    scope.estudio.sueldo_papa=parseFloat(scope.estudio.sueldo_papa);
                                    scope.estudio.sueldo_mama=parseFloat(scope.estudio.sueldo_mama);
                                    scope.ingresos.sueldo_papa=scope.estudio.sueldo_papa;
                                    scope.ingresos.sueldo_mama=scope.estudio.sueldo_mama;
                                    calcula();
                                    calculaEgresos();
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
           }
            
        };
        
        function guardarMama (){
            if(scope.estudio.id_mama!==undefined){
                var obj={};
                obj.id_padre_familia=scope.estudio.id_mama;
                obj.id_familia=scope.estudio.id_familia;
                obj.id_estudio=scope.estudio.id_estudio;
                obj.nombre=scope.estudio.nombre_mama;
                obj.apellido_paterno=scope.estudio.apellido_paterno_mama;
                obj.apellido_materno=scope.estudio.apellido_materno_mama;
                obj.edad=scope.estudio.edad_mama;
                obj.correo=scope.estudio.correo_mama;
                obj.rfc=scope.estudio.rfc_mama;
                obj.celular=scope.estudio.celular_mama;
                obj.profesion=scope.estudio.profesion_mama;
                obj.ocupacion=scope.estudio.ocupacion_mama;
                obj.empresa=scope.estudio.empresa_mama;
                obj.puesto=scope.estudio.puesto_mama;
                obj.giro=scope.estudio.giro_mama;
                obj.dueno=scope.estudio.dueno_mama;
                obj.antiguedad=scope.estudio.antiguedad_mama;
                obj.sueldo_neto=scope.estudio.sueldo_mama;

                console.log(obj);
                confirmaMsj(
                    "Confirmación de solicitud",
                    "¿Actualizar datos de mama?",
                    "Si",
                        function(){
                            FamiliaService.actualizarPapa(obj).then(
                                function(response){
                                    scope.estudio.padres=response.data;
                                    for(var i=0; i<scope.estudio.padres.length; i++){
                                        if(scope.estudio.padres[i].tipo_persona==='PAPA'){
                                            scope.estudio.id_papa=scope.estudio.padres[i].id_padre_familia;
                                            scope.estudio.nombre_papa=scope.estudio.padres[i].nombre;
                                            scope.estudio.apellido_paterno_papa=scope.estudio.padres[i].apellido_paterno;
                                            scope.estudio.apellido_materno_papa=scope.estudio.padres[i].apellido_materno;
                                            scope.estudio.edad_papa=scope.estudio.padres[i].edad;
                                            scope.estudio.correo_papa=scope.estudio.padres[i].correo;
                                            scope.estudio.rfc_papa=scope.estudio.padres[i].rfc;
                                            scope.estudio.celular_papa=scope.estudio.padres[i].celular;
                                            scope.estudio.profesion_papa=scope.estudio.padres[i].profesion;
                                            scope.estudio.ocupacion_papa=scope.estudio.padres[i].ocupacion;
                                            scope.estudio.empresa_papa=scope.estudio.padres[i].empresa;
                                            scope.estudio.puesto_papa=scope.estudio.padres[i].puesto;
                                            scope.estudio.giro_papa=scope.estudio.padres[i].giro;
                                            scope.estudio.dueno_papa=scope.estudio.padres[i].dueno;
                                            scope.estudio.antiguedad_papa=scope.estudio.padres[i].antiguedad;
                                            scope.estudio.sueldo_papa=scope.estudio.padres[i].sueldo_neto;
                                        }
                                        if(scope.estudio.padres[i].tipo_persona==='MAMA'){
                                            scope.estudio.id_mama=scope.estudio.padres[i].id_padre_familia;
                                            scope.estudio.nombre_mama=scope.estudio.padres[i].nombre;
                                            scope.estudio.apellido_paterno_mama=scope.estudio.padres[i].apellido_paterno;
                                            scope.estudio.apellido_materno_mama=scope.estudio.padres[i].apellido_materno;
                                            scope.estudio.edad_mama=scope.estudio.padres[i].edad;
                                            scope.estudio.correo_mama=scope.estudio.padres[i].correo;
                                            scope.estudio.rfc_mama=scope.estudio.padres[i].rfc;
                                            scope.estudio.celular_mama=scope.estudio.padres[i].celular;
                                            scope.estudio.profesion_mama=scope.estudio.padres[i].profesion;
                                            scope.estudio.ocupacion_mama=scope.estudio.padres[i].ocupacion;
                                            scope.estudio.empresa_mama=scope.estudio.padres[i].empresa;
                                            scope.estudio.puesto_mama=scope.estudio.padres[i].puesto;
                                            scope.estudio.giro_mama=scope.estudio.padres[i].giro;
                                            scope.estudio.dueno_mama=scope.estudio.padres[i].dueno;
                                            scope.estudio.antiguedad_mama=scope.estudio.padres[i].antiguedad;
                                            scope.estudio.sueldo_mama=scope.estudio.padres[i].sueldo_neto;
                                        }
                                    }
                                    scope.estudio.sueldo_papa=parseFloat(scope.estudio.sueldo_papa);
                                    scope.estudio.sueldo_mama=parseFloat(scope.estudio.sueldo_mama);
                                    scope.ingresos.sueldo_papa=scope.estudio.sueldo_papa;
                                    scope.ingresos.sueldo_mama=scope.estudio.sueldo_mama;
                                    calcula();
                                    calculaEgresos();
                                    mensaje('success', 'Aviso.', 'Se actualizaron los datos del papa correctamente.');
                                },
                                function(error){
                                    console.log('Error al guardar papa: '+error);
                                }
                            );
                        },
                    "No",
                        function(){}
                );
           }else{
                var obj={};
                obj.id_familia=scope.estudio.id_familia;
                obj.id_estudio=scope.estudio.id_estudio;
                obj.nombre=scope.estudio.nombre_mama;
                obj.apellido_paterno=scope.estudio.apellido_paterno_mama;
                obj.apellido_materno=scope.estudio.apellido_materno_mama;
                obj.edad=scope.estudio.edad_mama;
                obj.correo=scope.estudio.correo_mama;
                obj.rfc=scope.estudio.rfc_mama;
                obj.celular=scope.estudio.celular_mama;
                obj.profesion=scope.estudio.profesion_mama;
                obj.ocupacion=scope.estudio.ocupacion_mama;
                obj.empresa=scope.estudio.empresa_mama;
                obj.puesto=scope.estudio.puesto_mama;
                obj.giro=scope.estudio.giro_mama;
                obj.dueno=scope.estudio.dueno_mama;
                obj.antiguedad=scope.estudio.antiguedad_mama;
                obj.sueldo_neto=scope.estudio.sueldo_mama;
                obj.tipo_persona='MAMA';
                console.log(obj);
                confirmaMsj(
                    "Confirmación de solicitud",
                    "¿Guardar datos de la mama?",
                    "Si",
                        function(){
                            FamiliaService.guardarPapa(obj).then(
                                function(response){
                                    scope.estudio.padres=response.data;
                                    for(var i=0; i<scope.estudio.padres.length; i++){
                                        if(scope.estudio.padres[i].tipo_persona==='PAPA'){
                                            scope.estudio.id_papa=scope.estudio.padres[i].id_padre_familia;
                                            scope.estudio.nombre_papa=scope.estudio.padres[i].nombre;
                                            scope.estudio.apellido_paterno_papa=scope.estudio.padres[i].apellido_paterno;
                                            scope.estudio.apellido_materno_papa=scope.estudio.padres[i].apellido_materno;
                                            scope.estudio.edad_papa=scope.estudio.padres[i].edad;
                                            scope.estudio.correo_papa=scope.estudio.padres[i].correo;
                                            scope.estudio.rfc_papa=scope.estudio.padres[i].rfc;
                                            scope.estudio.celular_papa=scope.estudio.padres[i].celular;
                                            scope.estudio.profesion_papa=scope.estudio.padres[i].profesion;
                                            scope.estudio.ocupacion_papa=scope.estudio.padres[i].ocupacion;
                                            scope.estudio.empresa_papa=scope.estudio.padres[i].empresa;
                                            scope.estudio.puesto_papa=scope.estudio.padres[i].puesto;
                                            scope.estudio.giro_papa=scope.estudio.padres[i].giro;
                                            scope.estudio.dueno_papa=scope.estudio.padres[i].dueno;
                                            scope.estudio.antiguedad_papa=scope.estudio.padres[i].antiguedad;
                                            scope.estudio.sueldo_papa=scope.estudio.padres[i].sueldo_neto;
                                        }
                                        if(scope.estudio.padres[i].tipo_persona==='MAMA'){
                                            scope.estudio.id_mama=scope.estudio.padres[i].id_padre_familia;
                                            scope.estudio.nombre_mama=scope.estudio.padres[i].nombre;
                                            scope.estudio.apellido_paterno_mama=scope.estudio.padres[i].apellido_paterno;
                                            scope.estudio.apellido_materno_mama=scope.estudio.padres[i].apellido_materno;
                                            scope.estudio.edad_mama=scope.estudio.padres[i].edad;
                                            scope.estudio.correo_mama=scope.estudio.padres[i].correo;
                                            scope.estudio.rfc_mama=scope.estudio.padres[i].rfc;
                                            scope.estudio.celular_mama=scope.estudio.padres[i].celular;
                                            scope.estudio.profesion_mama=scope.estudio.padres[i].profesion;
                                            scope.estudio.ocupacion_mama=scope.estudio.padres[i].ocupacion;
                                            scope.estudio.empresa_mama=scope.estudio.padres[i].empresa;
                                            scope.estudio.puesto_mama=scope.estudio.padres[i].puesto;
                                            scope.estudio.giro_mama=scope.estudio.padres[i].giro;
                                            scope.estudio.dueno_mama=scope.estudio.padres[i].dueno;
                                            scope.estudio.antiguedad_mama=scope.estudio.padres[i].antiguedad;
                                            scope.estudio.sueldo_mama=scope.estudio.padres[i].sueldo_neto;
                                        }
                                    }
                                    scope.estudio.sueldo_papa=parseFloat(scope.estudio.sueldo_papa);
                                    scope.estudio.sueldo_mama=parseFloat(scope.estudio.sueldo_mama);
                                    scope.ingresos.sueldo_papa=scope.estudio.sueldo_papa;
                                    scope.ingresos.sueldo_mama=scope.estudio.sueldo_mama;
                                    calcula();
                                    calculaEgresos();
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
           }
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
                            scope.calculaEgresos();
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
                                    scope.calculaEgresos();
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
                                scope.calculaEgresos();
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
                            scope.calculaEgresos();
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
                                    scope.calculaEgresos();
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
                                scope.calculaEgresos();
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
                                    parseIngresos();
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
                                    parseIngresos();
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
        
        function guardarEgresos(){
            console.log(scope.egresos);
            scope.egresos.id_estudio=scope.estudio.id_estudio;
            scope.egresos.folio_estudio=scope.estudio.folio_estudio;
            scope.egresos.id_familia=scope.estudio.id_familia;
            confirmaMsj(
                "Confirmación de solicitud",
                "¿Actualizar datos?",
                "Si",
                    function(){
                        if(scope.egresos.id_egreso_familia!==undefined){
                            FamiliaService.actualizarEgresos(scope.egresos).then(
                                function(response){
                                    scope.egresos=response.data[0];
                                    parseEgresos();
                                    mensaje('success', 'Aviso.', 'Se actualizaron los datos de los egresos correctamente.');

                                },
                                function(error){
                                    console.log('Error al guardar hijo: '+error);
                                }
                            );
                        }else{
                            FamiliaService.guardarEgresos(scope.egresos).then(
                                function(response){
                                    scope.egresos=response.data[0];
                                    parseEgresos();
                                    mensaje('success', 'Aviso.', 'Se guardaron los datos de los egresos correctamente.');

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
        
        
        function guardarDocumentos(){
            scope.documentos.id_estudio=scope.estudio.id_estudio;
            scope.documentos.folio_estudio=scope.estudio.folio_estudio;
            scope.documentos.id_familia=scope.estudio.id_familia;
            console.log(scope.documentos);
            confirmaMsj(
                "Confirmación de solicitud",
                "¿Actualizar datos?",
                "Si",
                    function(){
                        if(scope.documentos.id_documento_familia!==undefined){
                            FamiliaService.actualizarDocumentos(scope.documentos).then(
                                function(response){
                                    scope.documentos=response.data[0];
                                    setBool();
                                    mensaje('success', 'Aviso.', 'Se actualizaron los datos de los documentos correctamente.');

                                },
                                function(error){
                                    console.log('Error al guardar hijo: '+error);
                                }
                            );
                        }else{
                            FamiliaService.guardarDocumentos(scope.documentos).then(
                                function(response){
                                    scope.documentos=response.data[0];
                                    setBool();
                                    mensaje('success', 'Aviso.', 'Se guardaron los datos de los documentos correctamente.');

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
        
        function guardarEvaluacion(){
            if(scope.evaluacion.apreciacion===undefined
                    ||scope.evaluacion.discrepancia===undefined
                    ||scope.evaluacion.apreciacion===''
                    ||scope.evaluacion.discrepancia===''
                    ||scope.evaluacion.apreciacion===null
                    ||scope.evaluacion.discrepancia===null){
                mensaje('alert', 'Campos obligatorios', 'Por favor complete los campos.');
                return;
            }
            scope.evaluacion.id_estudio=scope.estudio.id_estudio;
            scope.evaluacion.folio_estudio=scope.estudio.folio_estudio;
            scope.evaluacion.id_familia=scope.estudio.id_familia;
            console.log(scope.evaluacion);
            confirmaMsj(
                "Confirmación de solicitud",
                "¿Actualizar datos?",
                "Si",
                    function(){
                        if(scope.evaluacion.id_evaluacion_familia!==undefined){
                            FamiliaService.actualizarEvaluacion(scope.evaluacion).then(
                                function(response){
                                    scope.evaluacion=response.data[0];
                                    mensaje('success', 'Aviso.', 'Se actualizaron los datos de la evaluación correctamente.');

                                },
                                function(error){
                                    console.log('Error al guardar hijo: '+error);
                                }
                            );
                        }else{
                            FamiliaService.guardarEvaluacion(scope.evaluacion).then(
                                function(response){
                                    scope.evaluacion=response.data[0];
                                    mensaje('success', 'Aviso.', 'Se guardaron los datos de la evaluación correctamente.');

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
        
        /*comentario*/
        function verActualizarComentario(comentario){
            scope.banderaActualizar=true;
            scope.comentario=comentario;
            $("#modal_agregar_comentario").modal('show');
        }
        
        function agregarComentario(idFamilia){
            scope.comentario={};
            scope.banderaActualizar=false;
            scope.comentario.id_familia=idFamilia;
            $("#modal_agregar_comentario").modal('show');
        }
        
        function eliminarComentario(comentario){
            confirmaMsj("Confirmación de solicitud",
                "¿Eliminar comentario?",
                "Si",
                function(){
                    ComentarioService.eliminarComentario(comentario).then(
                        function(response){
                            scope.estudio.comentarios=response.data;
                            mensaje('success', 'Aviso.', 'Se eliminó el comentario seleccionado correctamente.');
                            scope.comentario={};
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
        
        function guardarComentario(){
            console.log(scope.comentario);
            scope.comentario.id_estudio=scope.estudio.id_estudio;
            scope.comentario.folio_estudio=scope.estudio.folio_estudio;
            
            if(scope.banderaActualizar){
                delete scope.comentario.tipo;
                confirmaMsj(
                    "Confirmación de solicitud",
                    "¿Actualizar datos?",
                    "Si",
                        function(){
                            ComentarioService.actualizarComentario(scope.comentario).then(
                                function(response){
                                    scope.estudio.comentarios=response.data;
                                    mensaje('success', 'Aviso.', 'Se actualizaron los datos del comentario correctamente.');
                                    $("#modal_agregar_comentario").modal('hide');
                                    scope.comentario={};
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
            scope.comentario.tipo='GENERAL';
            confirmaMsj(
                "Confirmación de solicitud",
                "¿Agregar comentario?",
                "Si",
                    function(){
                        ComentarioService.guardarComentario(scope.comentario).then(
                            function(response){
                                scope.estudio.comentarios=response.data;
                                mensaje('success', 'Aviso.', 'Se guardo el comentario correctamente.');
                                $("#modal_agregar_comentario").modal('hide');
                                scope.comentario={};
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
        
        /*FUNCIONES COMUNES*/
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
            var n=scope.estudio.dependientes.length+scope.estudio.hijos.length+2;
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
        
        function calculaEgresos(){
            var renta=0;
            var hipoteca=0;
            var cole=0;
            var otrasCole=0;
            var creditoAuto=0;
            
            for(var i=0; i<scope.estudio.propiedades.length; i++){
                if(scope.estudio.propiedades[i].status==='Rentada'){
                    renta+=parseFloat(scope.estudio.propiedades[i].monto_renta);
                }
                if(scope.estudio.propiedades[i].status==='Hipotecada'){
                    hipoteca+=parseFloat(scope.estudio.propiedades[i].monto_renta);
                }
            }
            
            for(var i=0; i<scope.estudio.hijos.length; i++){
                cole+=parseFloat(scope.estudio.hijos[i].colegiatura_actual);
                otrasCole+=parseFloat(scope.estudio.hijos[i].otras_colegiaturas);
            }
            
            for(var i=0; i<scope.estudio.vehiculos.length; i++){
                creditoAuto+=parseFloat(scope.estudio.vehiculos[i].pago_mensual);
            }
            
            scope.egresos.renta=renta;
            scope.egresos.credito_hipotecario=hipoteca;
            scope.egresos.colegiaturas=cole;
            scope.egresos.otras_colegiaturas=otrasCole;
            scope.egresos.credito_auto=creditoAuto;
            scope.calculaEgresosTotal();
        }
        
        function calculaEgresosServicios(){
            //scope.egresos.total_servicios+=scope.egresos.clases_particulares;
            scope.egresos.total_servicios=0;
            scope.egresos.total_servicios+=parseFloat(scope.egresos.agua);
            scope.egresos.total_servicios+=parseFloat(scope.egresos.luz);
            scope.egresos.total_servicios+=parseFloat(scope.egresos.telefono);
            //scope.egresos.total_servicios+=scope.egresos.servicio_domestico;
            scope.egresos.total_servicios+=parseFloat(scope.egresos.gas);
        }
        
        function calculaEgresosTotal(){
            scope.egresos.total_egresos=0;
            scope.egresos.total_egresos+=parseFloat(scope.egresos.alimentacion_despensa);
            scope.egresos.total_egresos+=parseFloat(scope.egresos.renta);
            scope.egresos.total_egresos+=parseFloat(scope.egresos.credito_hipotecario);
            scope.egresos.total_egresos+=parseFloat(scope.egresos.colegiaturas);
            scope.egresos.total_egresos+=parseFloat(scope.egresos.otras_colegiaturas);
            scope.egresos.total_egresos+=parseFloat(scope.egresos.clases_particulares);
            scope.egresos.total_egresos+=parseFloat(scope.egresos.servicio_domestico);
            scope.egresos.total_egresos+=parseFloat(scope.egresos.otros);
            scope.egresos.total_egresos+=parseFloat(scope.egresos.gasolina);
            scope.egresos.total_egresos+=parseFloat(scope.egresos.credito_auto);
            scope.egresos.total_egresos+=parseFloat(scope.egresos.pago_tdc_mensual);
            scope.egresos.total_egresos+=parseFloat(scope.egresos.vestido_calzado);
            scope.egresos.total_egresos+=parseFloat(scope.egresos.medico_medicinas);
            scope.egresos.total_egresos+=parseFloat(scope.egresos.diversion_entretenimiento);
            scope.egresos.total_egresos+=parseFloat(scope.egresos.clubes_deportivos);
            scope.egresos.total_egresos+=parseFloat(scope.egresos.seguros);
            scope.egresos.total_egresos+=parseFloat(scope.egresos.vacaciones);
            scope.egresos.total_egresos+=parseFloat(scope.egresos.otros2);
            scope.egresos.total_egresos+=parseFloat(scope.egresos.total_servicios);
            
            scope.egresos.diferencia_egre_ingre=scope.ingresos.total_ingresos-scope.egresos.total_egresos;
        }
        
        function setBool(){
            if(scope.documentos.carta_no_adeudo==='1'){
                scope.documentos.carta_no_adeudo=true;
            }
            if(scope.documentos.carta_no_adeudo==='0'){
                scope.documentos.carta_no_adeudo=false;
            }
            
            if(scope.documentos.firma_reglamento==='1'){
                scope.documentos.firma_reglamento=true;
            }
            if(scope.documentos.firma_reglamento==='0'){
                scope.documentos.firma_reglamento=false;
            }
            
            if(scope.documentos.nomina_carta==='1'){
                scope.documentos.nomina_carta=true;
            }
            if(scope.documentos.nomina_carta==='0'){
                scope.documentos.nomina_carta=false;
            }
            
            if(scope.documentos.poliza==='1'){
                scope.documentos.poliza=true;
            }
            if(scope.documentos.poliza==='0'){
                scope.documentos.poliza=false;
            }
            
            if(scope.documentos.estado_cuenta==='1'){
                scope.documentos.estado_cuenta=true;
            }
            if(scope.documentos.estado_cuenta==='0'){
                scope.documentos.estado_cuenta=false;
            }
            
            if(scope.documentos.recibos_renta==='1'){
                scope.documentos.recibos_renta=true;
            }
            if(scope.documentos.recibos_renta==='0'){
                scope.documentos.recibos_renta=false;
            }
            
            if(scope.documentos.facturas_hospital==='1'){
                scope.documentos.facturas_hospital=true;
            }
            if(scope.documentos.facturas_hospital==='0'){
                scope.documentos.facturas_hospital=false;
            }
           
             if(scope.documentos.comprobante_finiquito==='1'){
                scope.documentos.comprobante_finiquito=true;
            }
            if(scope.documentos.comprobante_finiquito==='0'){
                scope.documentos.comprobante_finiquito=false;
            }
            
            if(scope.documentos.demandas_judiciales==='1'){
                scope.documentos.demandas_judiciales=true;
            }
            if(scope.documentos.demandas_judiciales==='0'){
                scope.documentos.demandas_judiciales=false;
            }

            if(scope.documentos.servicios==='1'){
                scope.documentos.servicios=true;
            }
            if(scope.documentos.servicios==='0'){
                scope.documentos.servicios=false;
            }
            
            if(scope.documentos.pagos_credito_hipo==='1'){
                scope.documentos.pagos_credito_hipo=true;
            }
            if(scope.documentos.pagos_credito_hipo==='0'){
                scope.documentos.pagos_credito_hipo=false;
            }
            
            if(scope.documentos.pagos_credito_auto==='1'){
                scope.documentos.pagos_credito_auto=true;
            }
            if(scope.documentos.pagos_credito_auto==='0'){
                scope.documentos.pagos_credito_auto=false;
            }
            
            if(scope.documentos.otros==='1'){
                scope.documentos.otros=true;
            }
            if(scope.documentos.otros==='0'){
                scope.documentos.otros=false;
            }
        }
        function parseIngresos(){
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

        }
        
        function parseEgresos(){
            scope.egresos.alimentacion_despensa=parseFloat(scope.egresos.alimentacion_despensa);
            scope.egresos.renta=parseFloat(scope.egresos.renta);
            scope.egresos.credito_hipotecario=parseFloat(scope.egresos.credito_hipotecario);
            scope.egresos.colegiaturas=parseFloat(scope.egresos.colegiaturas);
            scope.egresos.otras_colegiaturas=parseFloat(scope.egresos.otras_colegiaturas);
            scope.egresos.clases_particulares=parseFloat(scope.egresos.clases_particulares);
            scope.egresos.agua=parseFloat(scope.egresos.agua);
            scope.egresos.luz=parseFloat(scope.egresos.luz);
            scope.egresos.telefono=parseFloat(scope.egresos.telefono);
            scope.egresos.servicio_domestico=parseFloat(scope.egresos.servicio_domestico);
            scope.egresos.gas=parseFloat(scope.egresos.gas);
            scope.egresos.total_servicios=parseFloat(scope.egresos.total_servicios);
            scope.egresos.gasolina=parseFloat(scope.egresos.gasolina);
            scope.egresos.credito_auto=parseFloat(scope.egresos.credito_auto);
            scope.egresos.pago_tdc_mensual=parseFloat(scope.egresos.pago_tdc_mensual);
            scope.egresos.saldo_tdc=parseFloat(scope.egresos.saldo_tdc);
            scope.egresos.creditos_comerciales=parseFloat(scope.egresos.creditos_comerciales);
            scope.egresos.vestido_calzado=parseFloat(scope.egresos.vestido_calzado);
            scope.egresos.medico_medicinas=parseFloat(scope.egresos.medico_medicinas);
            scope.egresos.diversion_entretenimiento=parseFloat(scope.egresos.diversion_entretenimiento);
            scope.egresos.clubes_deportivos=parseFloat(scope.egresos.clubes_deportivos);
            scope.egresos.seguros=parseFloat(scope.egresos.seguros);
            scope.egresos.vacaciones=parseFloat(scope.egresos.vacaciones);
            scope.egresos.otros2=parseFloat(scope.egresos.otros2);
            scope.egresos.otros=parseFloat(scope.egresos.otros);
            scope.egresos.total_egresos=parseFloat(scope.egresos.total_egresos);
            scope.egresos.diferencia_egre_ingre=parseFloat(scope.egresos.diferencia_egre_ingre);
        }
    };//end controller

})();