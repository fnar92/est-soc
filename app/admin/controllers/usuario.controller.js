(function () { 
    'use strict';
	
    angular
	.module('app.admin')
	.controller('UsuarioController', UsuarioController);
    
    function UsuarioController ($localStorage, AdminService, $rootScope, $state, $mdDialog, $mdToast, DialogService, RestService, AuthenticationService, Constants, UserService, $q) {
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
        
        scope.cargaUsuarios=cargaUsuarios;
        scope.agregarUsuario=agregarUsuario;
        scope.verActualizarUsuario=verActualizarUsuario;
        scope.guardarUsuario=guardarUsuario;
        scope.eliminarUsuario=eliminarUsuario;
        scope.cancelar=cancelar;
        
        scope.usuarios=[];
        scope.usuario={};
        scope.nuevoUsuario=true;
        scope.updateUsuario=false;
        
        scope.cargaUsuarios();
        
        function cargaUsuarios(){
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
        }
        
        function agregarUsuario(){
            scope.nuevoUsuario=true;
            scope.updateUsuario=false;
            $("#modal_agregar_usuario").modal('show');
        }
        
        function verActualizarUsuario(usuario){
            scope.nuevoUsuario=false;
            scope.updateUsuario=true;
            scope.usuario=usuario;
            $("#modal_agregar_usuario").modal('show');
        }
        
        function guardarUsuario(){
            if(scope.updateUsuario){
                confirmaMsj(
                    "Confirmación de solicitud",
                    "¿Actualizar información del usuario?",
                    "Si",
                        function(){
                            var obj=scope.usuario;
                            obj.tipo_usuario=$rootScope.tipoUsuario;
                            show();
                            var promesas=[];
                            promesas.push(AdminService.updateUser(obj));
                            promesas.push(AdminService.getUserList($rootScope.tipoUsuario, $rootScope.user.id_institucion));
                            $q.all(promesas)
                                .then(
                                    function(response){
                                        mensaje('success', 'Aviso.', 'Se actualizaron los datos del usuario correctamente.');
                                        scope.usuarios=response[1].data;
                                        scope.cancelar();
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
            if(scope.nuevoUsuario){
                confirmaMsj(
                    "Confirmación de solicitud",
                    "¿Crear nuevo usuario?",
                    "Si",
                        function(){
                            var obj=scope.usuario;
                            obj.tipo_usuario=$rootScope.tipoUsuario;
                            obj.id_institucion=$rootScope.user.id_institucion;
                            show();
                            var promesas=[];
                            promesas.push(AdminService.addUser(obj));
                            promesas.push(AdminService.getUserList($rootScope.tipoUsuario, $rootScope.user.id_institucion));
                            $q.all(promesas)
                                .then(
                                    function(response){
                                        mensaje('success', 'Aviso.', 'Se dio de alta al nuevo usuario correctamente.');
                                        scope.usuarios=response[1].data;
                                        scope.cancelar();
                                        hide();
                                    }
                                );
                        },
                    "No",
                        function(){}
                );
            }
        }
        
        function eliminarUsuario(usuario){
            confirmaMsj(
                "Confirmación de solicitud",
                "¿Esta seguro de eliminar usuario? Esta es una acción permanente.",
                "Si",
                    function(){
                        var obj=usuario;
                        obj.tipo_usuario=$rootScope.tipoUsuario;
                        show();
                        var promesas=[];
                        promesas.push(AdminService.deleteUser(obj));
                        promesas.push(AdminService.getUserList($rootScope.tipoUsuario, $rootScope.user.id_institucion));
                        $q.all(promesas)
                            .then(
                                function(response){
                                    mensaje('success', 'Aviso.', 'Se eliminó al usuario correctamente.');
                                    scope.usuarios=response[1].data;
                                    scope.cancelar();
                                    hide();
                                }
                            );
                    },
                "No",
                    function(){}
            );
        }
        
        function cancelar(){
            scope.usuario={};
            scope.nuevoUsuario=true;
            scope.updateUsuario=false;
            $("#modal_agregar_usuario").modal('hide');
        }
        
        
    };//end controller

})();