(function () { 
    'use strict';
	
    angular
	.module('app.admin')
	.controller('UsuarioController', UsuarioController);
    
    function UsuarioController ($localStorage, AdminService, $rootScope, $state, $mdDialog, $mdToast, DialogService, RestService, AuthenticationService, Constants, UserService) {
        /* jshint validthis: true */
        console.log('init usuario controller');
        
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
        show();
        
        scope.agregarUsuario=agregarUsuario;
        
        
        
        scope.usuarios=[];
        scope.usuario={};
        
        
        
        AdminService.getUserList($rootScope.tipoUsuario, $rootScope.user.id_institucion).then(
            function(response){
                scope.usuarios=response.data;
                hide();
            },
            function (error){
                console.log('Error al obtener los usuarios'+error);
                hide();
                error();
                
            }
        );

        function agregarUsuario(){
            $("#modal_agregar_usuario").modal('show');
        }
        
    };//end controller

})();