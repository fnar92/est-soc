(function () { 
    'use strict';
	
    angular
	.module('app.admin')
	.controller('AdminController', AdminController);
    
    function AdminController ($localStorage, AdminService, $rootScope, $state, $mdDialog, $mdToast, DialogService, RestService, AuthenticationService, Constants, UserService) {
        /* jshint validthis: true */
        console.log('init admin panel');
         var scope = this;  
         scope.user={};
         scope.institucion={};
        //Check session
        AuthenticationService.isAuth();
        if (!$localStorage.globals||!$rootScope.isAuth) {
            mensaje('error', 'Session', 'Tu session ha expirado.');
            location.href='#/login';
        }
        
        UserService.getUser().then(
            function(response){
                scope.user=$rootScope.user=response.data.usuario;
                if($rootScope.tipoUsuario==='2'){
                    scope.institucion=$rootScope.institucion=response.data.institucion;
                }
                hide();
            }, function(error){
                console.log('Error al guardar completar la solicitud: '+error);
            }
        );
        
        if($rootScope.tipoUsuario==='2'){
            if($rootScope.user.id_institucion===undefined){
                error();
                location.href='#/';
            }
        }
        
       
        
          hide();
    };//end controller

})();