(function () { 
    'use strict';
	
    angular
	.module('app.estudios')
	.controller('EstudiosController', EstudiosController);
    
    function EstudiosController ($localStorage, $rootScope, $state, $mdDialog, $mdToast, DialogService, RestService, AuthenticationService, Constants, UserService) {
        /* jshint validthis: true */
        console.log('init estudios');
        
        //Check session
        AuthenticationService.isAuth();
        
        var scope = this;  
        scope.estudios=[];
        scope.familia={};
        scope.estudio={};
        scope.bandera=false;
        scope.bandera_busco=true;
        
        //acciones
        scope.guardar_solicitud=guardar_solicitud;
        scope.buscar_familias=buscar_familias;
    
       
        
        
        if (!$localStorage.globals||!$rootScope.isAuth) {
            mensaje('error', 'Session', 'Tu session ha expirado.');
            location.href='#/login';
        }
        
        function buscar_familias(){
            scope.bandera_busco=false;
        }
        
        function guardar_solicitud(){
            confirmaMsj("Confirmación de solicitud",
                        "¿Está seguro que se ingresaron todos los datos correctamente?",
                        "Si",
                        function(){guardar_solicitud_action();},
                        "No",
                        function(){console.log('no ok');}
                    );
            
        };
        
        function guardar_solicitud_action(){
            scope.familia.id_institucion= parseInt($rootScope.user.id_institucion);
            console.log(scope.familia);
            console.log(scope.estudio);
        };
        
        
        
        
       
   
        
    };//end controller

})();