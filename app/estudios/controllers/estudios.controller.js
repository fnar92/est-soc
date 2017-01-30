(function () { 
    'use strict';
	
    angular
	.module('app.estudios')
	.controller('EstudiosController', EstudiosController);
    
    function EstudiosController (EstudiosService, $localStorage, $rootScope, $state, $mdDialog, $mdToast, DialogService, RestService, AuthenticationService, Constants, UserService) {
        /* jshint validthis: true */
        console.log('init estudios');
        
        //Check session
        AuthenticationService.isAuth();
        
        var scope = this;  
        scope.load=false;
        scope.estudios=[];
        scope.familia={};
        scope.estudio={};
        scope.filtroFamilia="";
        scope.listaFamiliasEncontradas=[];
        scope.opcion={};
        scope.currentPage =0;
        scope.pageSize = 7;
        scope.numberOfPages = numberOfPages;
        
        //Banderas
        scope.bandera_menu=true;
        scope.bandera=false;
        scope.bandera_busco=true;
        
        //acciones
        scope.accionInicial=accionInicial;
        scope.regresar=regresar;
        scope.guardar_solicitud=guardar_solicitud;
        scope.buscar_familias=buscar_familias;
        scope.seleccionarFamilia=seleccionarFamilia;
        scope.continuarFamilia=continuarFamilia;
        scope.guardarEstudio=guardarEstudio;
       
        console.log($rootScope.institucion.clave);
        
        if (!$localStorage.globals||!$rootScope.isAuth) {
            mensaje('error', 'Session', 'Tu session ha expirado.');
            location.href='#/login';
        }
        
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
                    },
                    function(error){
                        scope.load=false;
                        console.log('Error al obtener familias filtradas');
                    }
                );
            
        };
        
        function seleccionarFamilia(familia){
            scope.familia=familia;
        };
        
        function continuarFamilia(){
            if(scope.familia.id_familia===undefined){
                mensaje('error', 'Solicitud estudio', 'Seleccione una familia para continuar.');
                return;
            }
            console.log('Familia seleccionada:'+json(scope.familia));
            
            scope.opcion='2';
        };
        
        function guardar_solicitud(){
            confirmaMsj("Confirmación de solicitud",
                        "¿Está seguro que se ingresaron todos los datos correctamente?",
                        "Si",
                        function(){guardarSolicitudAccion();},
                        "No",
                        function(){}
                    );
            
        };
        
        function guardarSolicitudAccion(){
            
            console.log(scope.familia);
            console.log(scope.estudio);
            //Insertar familia nueva
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
                            scope.estudio.id_institucion= parseInt($rootScope.user.id_institucion);
                            scope.estudio.id_familia=response.data.id_familia;
                            scope.estudio.clave_institucion=$rootScope.institucion.clave;
                            console.log(scope.estudio);
                            scope.guardarEstudio(scope.estudio);
                            mensaje('success', 'Solicitud de estudio', 'Estudio enviado correctamente');
                        }
                    },
                    function(error){
                        mensaje('error','Solicitud de estudio','Ocurrio un error al guardar la información. Intente mas tarde.');
                        console.log('Error al guardar familia: '+error);
                    }
                );
                
            }
            //Nueva familia
            
            
            //Estudio siempre nuevo
            
            
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
        
        
        
       
   
        
    };//end controller

})();