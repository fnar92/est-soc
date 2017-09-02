(function () { 
    'use strict';
	
    angular
	.module('app.admin')
	.controller('AdminController', AdminController);
    
    function AdminController ($localStorage, AdminService, $rootScope, $state, $mdDialog, $mdToast, DialogService, RestService, AuthenticationService, Constants, UserService) {
        /* jshint validthis: true */
        console.log('init admin panel');
        
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
        
          hide();
    };//end controller

})();