(function () { 
    'use strict';
	
    angular
	.module('app.estudios')
	.controller('EstudiosCrearController', EstudiosCrearController);
    
    function EstudiosCrearController (EstudiosService, $localStorage, $rootScope, $state, $mdDialog, $mdToast, DialogService, RestService, AuthenticationService, Constants, UserService) {
        /* jshint validthis: true */
        console.log('init estudios crear');
        
        //Check session
        AuthenticationService.isAuth();
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
        
        var scope = this;  
        
        scope.estudios=[];
        scope.familia={};
        scope.estudio={};
        scope.estudioInstitucion={};
        scope.filtroFamilia="";
        scope.listaFamiliasEncontradas=[];
        scope.opcion={};
        scope.currentPage =0;
        scope.pageSize = 7;
        scope.numberOfPages = numberOfPages;
        scope.id_institucion=""+$rootScope.user.id_institucion+"";
        scope.tomoFamilia=false;
        
        //Banderas
        scope.bandera_menu=true;
        scope.bandera=false;
        scope.bandera_busco=true;
        scope.bandera_selecciono=false;
        scope.guardo=false;
        scope.load=false;
        
        //acciones
        scope.accionInicial=accionInicial;
        scope.regresar=regresar;
        scope.guardar_solicitud=guardar_solicitud;
        scope.buscar_familias=buscar_familias;
        scope.seleccionarFamilia=seleccionarFamilia;
        scope.continuarFamilia=continuarFamilia;
        scope.guardarEstudio=guardarEstudio;
        scope.solicitarEstudio=solicitarEstudio;
        scope.cancelarEstudio=cancelarEstudio;
        
       
        function accionInicial(){
            scope.bandera_menu=false;
        };
        
        function regresar(){
            scope.bandera_menu=true;
            scope.opcion={};
        };
        
        function buscar_familias(){
            scope.bandera_busco=false;
            scope.load=true;
            EstudiosService.obtenerFamilias($rootScope.user.id_institucion, scope.filtroFamilia)
                .then(
                    function(response){
                        scope.load=false;
                        scope.listaFamiliasEncontradas=response.data;
                        
                        var temp=[];
                        for(var i=0; i<scope.listaFamiliasEncontradas.length; i++){
                            var estudio=scope.listaFamiliasEncontradas[i].estudio;
                            var es=false;
                            var xx=0;
                            for(var j=0; j<estudio.length; j++){
                                if(estudio[j].id_institucion===scope.id_institucion){
                                    es=true;
                                    estudio[j].tieneEstudio=true;
                                    xx=j;
                                    break;
                                }else{
                                    estudio[j].tieneEstudio=false;
                                    xx=j;
                                }
                            }
                            var fam=scope.listaFamiliasEncontradas[i];
                            //alert(json());
                            fam.estudio=estudio[xx];
                            temp.push(fam);
                        }
                        scope.listaFamiliasEncontradas=temp;
                        console.log(scope.listaFamiliasEncontradas);
                    },
                    function(error){
                        scope.load=false;
                        console.log('Error al obtener familias filtradas');
                    }
                );
            
        };
        
        function seleccionarFamilia(familia){
            scope.bandera_selecciono=true;
            scope.familia=familia;
        };
        
        function continuarFamilia(){
            if(scope.familia.id_familia===undefined){
                mensaje('error', 'Solicitud estudio', 'Seleccione una familia para continuar.');
                return;
            }
            scope.opcion='2';
        };
        
        function solicitarEstudio(familia, estudio){
            scope.estudio=estudio;
            scope.familia=familia;
            scope.opcion='2';
        }
        
        function guardar_solicitud(){
            if(scope.familia.familia===''||
                scope.familia.familia===null||
                scope.familia.familia===undefined
                || scope.estudio.pago===undefined 
                    ){
                mensaje('error','Error de validación','Completa todos los compos');
                return;
            }
            
            confirmaMsj("Confirmación de solicitud",
                        "¿Está seguro que se ingresaron todos los datos correctamente?",
                        "Si",
                        function(){guardarSolicitudAccion();},
                        "No",
                        function(){}
                    );
            
        };
        
        function guardarSolicitudAccion(){
            //Insertar familia nueva
            show();
            if(scope.familia.id_familia===undefined){
                scope.familia.id_institucion= parseInt($rootScope.user.id_institucion);
                EstudiosService.guardarFamilia(scope.familia).then(
                    function(response){
                        if(response.data.id_familia===undefined){
                            mensaje('error','Solicitud de estudio','Ocurrio un error al guardar la información. Intente mas tarde.');
                            return;
                        }else{
                            //Guardar el estudio
                            scope.estudio.id_estatus_estudio=1;//Enviado para solicitud
                            scope.estudio.id_institucion_solicito= parseInt($rootScope.user.id_institucion);
                            scope.estudio.id_familia=response.data.id_familia;
                            scope.estudio.clave_institucion=$rootScope.institucion.clave_institucion;
                            scope.estudio.institucion_familia=$rootScope.institucion.clave_institucion;
                            scope.estudio.institucion_solicito=$rootScope.institucion.clave_institucion;
                            scope.estudio.id_usuario_asignado=0;
                            scope.estudio.id_usuario_asigno=0;
                            EstudiosService.guardarEstudio(scope.estudio).then(
                                function(response){
                                    if(response.data.id_estudio===undefined){
                                        mensaje('error','Solicitud de estudio','Ocurrio un error al guardar la información. Intente mas tarde.');
                                        return;
                                    }else{
                                        scope.estudioInstitucion.id_estudio=response.data.id_estudio;
                                        scope.estudioInstitucion.pago=scope.estudio.pago;
                                        scope.estudioInstitucion.num_recibo=scope.estudio.num_recibo;
                                        scope.estudioInstitucion.id_institucion=parseInt($rootScope.user.id_institucion);
                                        EstudiosService.guardarEstudioInstitucion(scope.estudioInstitucion);
                                        setTimeout(function(){
                                            hide();
                                            mensaje('success', 'Solicitud de estudio', 'Estudio enviado correctamente');
                                            location.href= "#/estudios/ver";
                                            window.scrollTo(0, 0); 
                                        }, 3000);
                                    }
                                },
                                function(error){
                                    console.log('Error al guardar el estudio: '+error);
                                }
                            );
                        }
                    },
                    function(error){
                        hide();
                        mensaje('error','Solicitud de estudio','Ocurrio un error al guardar la información. Intente mas tarde.');
                        console.log('Error al guardar familia: '+error);
                    }
                );
                
            }else{
                if(scope.familia.id_familia!==undefined&&scope.estudio.id_estudio===undefined){
                    scope.estudio.id_estatus_estudio=1;//Enviado para solicitud
                    scope.estudio.id_institucion_solicito= parseInt($rootScope.user.id_institucion);
                    scope.estudio.id_familia=scope.familia.id_familia;
                    scope.estudio.clave_institucion=scope.familia.clave_institucion;
                    scope.estudio.institucion_familia=scope.estudio.clave_institucion;
                    scope.estudio.institucion_solicito=$rootScope.institucion.clave_institucion;
                    scope.estudio.id_usuario_asignado=0;
                    scope.estudio.id_usuario_asigno=0;

                    EstudiosService.guardarEstudio(scope.estudio).then(
                        function(response){
                            if(response.data.id_estudio===undefined){
                                mensaje('error','Solicitud de estudio','Ocurrio un error al guardar la información. Intente mas tarde.');
                                return;
                            }else{
                                scope.estudioInstitucion.id_estudio=response.data.id_estudio;
                                scope.estudioInstitucion.id_institucion=parseInt($rootScope.user.id_institucion);
                                scope.estudioInstitucion.pago=scope.estudio.pago;
                                scope.estudioInstitucion.num_recibo=scope.estudio.num_recibo;
                                EstudiosService.guardarEstudioInstitucion(scope.estudioInstitucion);
                                setTimeout(function(){
                                    hide();
                                    mensaje('success', 'Solicitud de estudio', 'Estudio enviado correctamente');
                                    location.href= "#/estudios/ver";
                                    window.scrollTo(0, 0); 
                                }, 3000);
                            }
                        },
                        function(error){
                            hide();
                            mensaje('error','Solicitud de estudio','Ocurrio un error al guardar la información. Intente mas tarde.');
                            console.log('Error al guardar el estudio: '+error);
                        }
                    );
                }else{
                    if(scope.estudio.id_estudio!==undefined){
                        scope.estudioInstitucion.id_estudio=scope.estudio.id_estudio;
                        scope.estudioInstitucion.id_institucion=parseInt($rootScope.user.id_institucion);
                        scope.estudioInstitucion.pago=scope.estudio.pago;
                        scope.estudioInstitucion.num_recibo=scope.estudio.num_recibo;
                        EstudiosService.guardarEstudioInstitucion(scope.estudioInstitucion).then(
                            function(response){
                                setTimeout(function(){
                                    hide();
                                    mensaje('success', 'Solicitud de estudio', 'Estudio enviado correctamente');
                                    location.href= "#/estudios/ver";
                                    window.scrollTo(0, 0); 
                                }, 3000);
                            },
                            function(error){
                                hide();
                                mensaje('error','Solicitud de estudio','Ocurrio un error al guardar la información. Intente mas tarde.');
                                console.log('Error al guardar el estudio institucion: '+error);
                            }
                        );
                        
                    }
                }
            }
            
            
        };
        
        function guardarEstudio(data){
            EstudiosService.guardarEstudio(data).then(
                function(response){
                    return true;
                },
                function(error){
                    console.log('Error al guardar el estudio: '+error);
                    return false;
                }    
            );
        }
        function numberOfPages(){
            return Math.ceil(scope.listaFamiliasEncontradas.length/scope.pageSize);  
        };
        
        function cancelarEstudio(estudio){
            confirmaMsj("Confirmación de solicitud",
                "¿Está seguro que desea cancelar el estudio?",
                "Si",
                function(){
                    EstudiosService.cancelarEstudioInstitucion(estudio.id_estudio_institucion).then(
                        function(response){
                            mensaje('success', 'Cancelar estudio', 'Se cancelo el estudio correctamente.');
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