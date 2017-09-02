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
        scope.verActualizarUsuario=verActualizarUsuario;
        scope.guardarUsuario=guardarUsuario;
        scope.eliminarUsuario=eliminarUsuario;
        scope.cancelar=cancelar;
        
        scope.usuarios=[];
        scope.usuario={};
        scope.nuevoUsuario=true;
        scope.updateUsuario=false;
        
        
        
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
            scope.nuevoUsuario=true;
            scope.updateUsuario=false;
            console.log('click en add');
            console.log(scope.nuevoUsuario+' '+scope.updateUsuario);
            $("#modal_agregar_usuario").modal('show');
        }
        
        function verActualizarUsuario(usuario){
            scope.nuevoUsuario=false;
            scope.updateUsuario=true;
            scope.usuario=usuario;
            console.log(scope.usuario);
            console.log('click en update');
            console.log(scope.nuevoUsuario+' '+scope.updateUsuario);
            $("#modal_agregar_usuario").modal('show');
        }
        
        function guardarUsuario(){
            alert();
            console.log(scope.usuario);
        }
        
        function eliminarUsuario(usuario){
            
            
        }
        
        function cancelar(){
            scope.usuario={};
            scope.nuevoUsuario=true;
            scope.updateUsuario=false;
            $("#modal_agregar_usuario").modal('hide');
        }
        
        
    };//end controller

})();