(function () { 
    'use strict';
	
    angular
	.module('app.estudios')
	.controller('EstudiosCrearController', EstudiosCrearController);
    
    function EstudiosCrearController ($localStorage, $rootScope, $state, $mdDialog, $mdToast, DialogService, RestService, AuthenticationService, Constants, UserService) {
        /* jshint validthis: true */
        console.log('init estudios');
        
        //Check session
        AuthenticationService.isAuth();
        
        var scope = this;  
        scope.estudios=[];
        //functions
        
        scope.opcion={};
        
        
        if (!$localStorage.globals||!$rootScope.isAuth) {
            mensaje('error', 'Session', 'Tu session ha expirado.');
            location.href='#/login';
        }
        
        
        
       
   
        
    };//end controller

})();