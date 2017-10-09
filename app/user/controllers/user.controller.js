(function () { 
    'use strict';
	
    angular
	.module('app.user')
	.controller('UserController', UserController);
    
    function UserController ($localStorage, $rootScope, $state, $mdDialog, $mdToast, DialogService, RestService, AuthenticationService, Constants, UserService, $q) {
        /* jshint validthis: true */
        console.log('init user controller info');
        
        //Check session
        AuthenticationService.isAuth();
        if (!$localStorage.globals||!$rootScope.isAuth) {
            mensaje('error', 'Session', 'Tu session ha expirado.');
            location.href='#/login';
        }
        
        if($rootScope.tipoUsuario==='2'){
            if($rootScope.user.id_institucion===undefined){
                error();
                location.href='#/';
            }
        }
        
        if ($localStorage.globals) {
            $rootScope.isAuth=true;
            $rootScope.tipoUsuario=$localStorage.globals.type;
            $rootScope.rolUsuario=$localStorage.globals.role;
        }
        
        var scope = this;  
        
        scope.user={};
        scope.tipoUsuario=0;
        scope.rolUsuario=0;
        scope.institucion={};
        
        scope.pw1;
        scope.pw2;
        
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
        
       
        //functions
        
        scope.guardarPassword=guardarPassword;
        scope.updateInfo=updateInfo;
        
        function updateInfo(){
             confirmaMsj(
                "Confirmación de solicitud",
                "¿Actualizar datos?",
                "Si",
                    function(){
                        var obj=scope.user;
                        obj.tipo_usuario=$rootScope.tipoUsuario;
                        obj.id_usuario=scope.user.id_usuario;
                        show();
                        var promesas=[];
                        promesas.push(UserService.updateUser(obj));
                        $q.all(promesas)
                            .then(
                                function(response){
                                    mensaje('success', 'Aviso.', 'Se actualizaron los datos correctamente.');
                                    hide();
                                }, function(error){
                                    console.log('Error al guardar completar la solicitud: '+error);
                                }
                            );
                    },
                "No",
                    function(){}
            );
        }
        
        function guardarPassword(){
            confirmaMsj(
                "Confirmación de solicitud",
                "¿Actualizar contraseña?",
                "Si",
                    function(){
                        var obj=scope.user;
                        obj.tipo_usuario=$rootScope.tipoUsuario;
                        obj.id_usuario=scope.user.id_usuario;
                        obj.password=scope.pw1;
                        show();
                        var promesas=[];
                        promesas.push(UserService.updateUser(obj));
                        $q.all(promesas)
                            .then(
                                function(response){
                                    mensaje('success', 'Aviso.', 'Se actualizo tu contraseña correctamente.');
                                    hide();
                                    scope.pw1="";
                                    scope.pw2="";
                                }, function(error){
                                    console.log('Error al guardar completar la solicitud: '+error);
                                }
                            );
                    },
                "No",
                    function(){}
            );
        }
        
    };//end controller

})();