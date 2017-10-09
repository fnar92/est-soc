(function () { 
    'use strict';
	
    angular
	.module('app.admin')
	.controller('UsuarioController', UsuarioController);
    
    function UsuarioController ($localStorage, AdminService, $rootScope, $state, $mdDialog, $mdToast, DialogService, RestService, AuthenticationService, Constants, UserService, $q) {
        /* jshint validthis: true */
        console.log('init usuario controller');
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
            if($rootScope.user===undefined||$rootScope.user.id_institucion===undefined){
                error();
                location.href='#/';
            }
        }
        
        if ($localStorage.globals) {
            $rootScope.isAuth=true;
            $rootScope.tipoUsuario=$localStorage.globals.type;
            $rootScope.rolUsuario=$localStorage.globals.role;
        }
        
        
         
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
        scope.checkUser=checkUser;
        
        scope.validUser=false;
        scope.checkingUser=false;
        scope.NotvalidUser=false;
        
        scope.cargaUsuarios();
        

        function checkUser(){
            console.log(scope.usuario.username);
            if(scope.updateUsuario){
                return;
            }
            if(scope.usuario.username===undefined){
                scope.validUser=false;
                scope.NotvalidUser=false;
                scope.checkingUser=false;
                return;
            }
            if(scope.usuario.username!==null||scope.usuario.username!==""||scope.usuario.username!==undefined){
                scope.checkingUser=false;
                scope.NotvalidUser=false;
                scope.checkingUser=true;
                var data={};
                data.tipo_usuario=$rootScope.tipoUsuario;
                data.username=scope.usuario.username;
                UserService.checkUser(data).then(
                    function (response){
                        var data=response.data;                
                        if(data===1){
                            scope.NotvalidUser=true;
                            scope.validUser=false;
                        }else if(data===0){
                            scope.NotvalidUser=false;
                            scope.validUser=true;
                        }
                        scope.checkingUser=false;
                    }, 
                    function (err){
                        console.log('Error al buscar username');
                        scope.validUser=false;
                        scope.NotvalidUser=false;
                        scope.checkingUser=false;
                    }
                );
            }else{
                scope.validUser=false;
                scope.NotvalidUser=false;
                scope.checkingUser=false;
            }
            
        }
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
            scope.usuario={};
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
                            $q.all(promesas)
                                .then(
                                    function(response){
                                        mensaje('success', 'Aviso.', 'Se actualizaron los datos del usuario correctamente.');
                                        scope.usuarios=response[0].data;
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
                if(scope.usuario.username===undefined||
                        scope.usuario.username===""||scope.NotvalidUser){
                    mensaje('error', 'Error de validación', 'Verifique sus datos');
                    return;
                }
                confirmaMsj(
                    "Confirmación de solicitud",
                    "¿Crear nuevo usuario?",
                    "Si",
                        function(){
                            var obj=scope.usuario;
                            obj.tipo_usuario=$rootScope.tipoUsuario;
                            obj.id_institucion=$rootScope.user.id_institucion;
                            obj.estatus=0;
                            show();
                            var promesas=[];
                            promesas.push(AdminService.addUser(obj));
                            $q.all(promesas)
                                .then(
                                    function(response){
                                        mensaje('success', 'Aviso.', 'Se dio de alta al nuevo usuario correctamente.');
                                        scope.usuarios=response[0].data;
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
                        $q.all(promesas)
                            .then(
                                function(response){
                                    mensaje('success', 'Aviso.', 'Se eliminó al usuario correctamente.');
                                    scope.usuarios=response[0].data;
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
            scope.validUser=false;
            scope.NotvalidUser=false;
            scope.checkingUser=false;
            $("#modal_agregar_usuario").modal('hide');
        }
        
        
    };//end controller

})();