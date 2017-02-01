(function () { 
    'use strict';
	
    angular
	.module('app.estudios')
	.controller('EstudiosDetalleController', EstudiosDetalleController);
    
    function EstudiosDetalleController (EstudiosService, $localStorage, $rootScope, $state, $mdDialog, $mdToast, DialogService, RestService, AuthenticationService, Constants, UserService) {
        /* jshint validthis: true */
        console.log('init estudios ver detalle');
        
        //Check session
        AuthenticationService.isAuth();
        
        var scope = this;  
        /*if(EstudiosService.estudioSeleccionado.id_estudio===undefined){
            mensaje('error', 'Error', 'Error al obtener información');
            location.href='#/';
        }*/
        if(EstudiosService.estudioSeleccionado.id_estudio===undefined){
            error();
        }
        scope.estudio=EstudiosService.estudioSeleccionado;
        
        //Banderas
        scope.load=false;
        scope.verAccion=false;
        
        //acctiones
       
        if (!$localStorage.globals||!$rootScope.isAuth) {
            mensaje('error', 'Session', 'Tu session ha expirado.');
            location.href='#/login';
        }
        
       
   
        
    };//end controller

})();