(function () { 
    'use strict';
	
    angular
	.module('app.admin')
	.controller('InstitucionController', InstitucionController);
    
    function InstitucionController ($localStorage, AdminService, $rootScope, $state, $mdDialog, $mdToast, DialogService, RestService, AuthenticationService, Constants, UserService, $q) {
        /* jshint validthis: true */
        console.log('init InstitucionController');
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
        
        scope.cargaInstituciones=cargaInstituciones;
        scope.agregarInstitucion=agregarInstitucion;
        scope.verActualizarInstitucion=verActualizarInstitucion;
        scope.guardarInstitucion=guardarInstitucion;
        scope.eliminarInstitucion=eliminarInstitucion;
        scope.verUsuariosInstitucion=verUsuariosInstitucion;
        scope.cancelar=cancelar;
        scope.cancelar2=cancelar2;
        scope.cancelar3=cancelar3;
        scope.nuevoUsuarioAdmin=nuevoUsuarioInstitucion;
        scope.guardarUsuarioInstitucion=guardarUsuarioInstitucion;
        scope.eliminarUsuario=eliminarUsuario;
        
        scope.instituciones=[];
        scope.institucion={};
        scope.nuevaInstitucion=true;
        scope.updateInstitucion=false;
        scope.listaUsuarios=[];
        scope.usuario={};
        
        
        scope.checkUser=checkUser;
        scope.validUser=false;
        scope.checkingUser=false;
        scope.NotvalidUser=false;
        
        scope.cargaInstituciones();

        
        function checkUser(){
            console.log(scope.usuario.username);
            if(scope.updateUsuario){
                return;
            }
            if(scope.usuario.username===undefined||scope.usuario.username===""){
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
                data.tipo_usuario=2;
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
        
        function cargaInstituciones(){
            AdminService.getInstitucionList().then(
                function(response){
                    scope.instituciones=response.data;
                    hide();
                },
                function (error){
                    console.log('Error al obtener las instituciones'+error);
                    hide();
                    error();
                }
            );
        }
        
        function agregarInstitucion(){
            scope.nuevaInstitucion=true;
            scope.updateInstitucion=false;
            scope.institucion={};
            $("#modal_agregar_institucion").modal('show');
        }
        
        function nuevoUsuarioInstitucion(){
            scope.usuario={};
            $("#modal_agregar_institucion_usuario").modal('show');
        }
        
        function verUsuariosInstitucion(i){
            scope.listaUsuarios=[];
            scope.institucion=i;
            
            AdminService.getUsuariosInstitucionList(scope.institucion.id_institucion)
            .then(
                function(response){
                    scope.listaUsuarios=response.data;
                },
                function(err){
                        console.log('Error al obtener usuarios por institucion'+JSON.stringify(err));
                }
            );
            $("#modal_usuarios_institucion").modal('show');
        }
        
        function verActualizarInstitucion(i){
            scope.nuevaInstitucion=false;
            scope.updateInstitucion=true;
            scope.institucion=i;
            $("#modal_agregar_institucion").modal('show');
        }
        
        function guardarInstitucion(){
            if(scope.updateInstitucion){
                confirmaMsj(
                    "Confirmación de solicitud",
                    "¿Actualizar información de la institución?",
                    "Si",
                        function(){
                            var obj=scope.institucion;
                            show();
                            var promesas=[];
                            promesas.push(AdminService.updateInstitucion(obj));
                            $q.all(promesas)
                                .then(
                                    function(response){
                                        mensaje('success', 'Aviso.', 'Se actualizaron los datos de la institución correctamente.');
                                        scope.instituciones=response[0].data;
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
            if(scope.nuevaInstitucion){
                confirmaMsj(
                    "Confirmación de solicitud",
                    "¿Crear nueva institución?",
                    "Si",
                        function(){
                            var obj=scope.institucion;
                            show();
                            var promesas=[];
                            promesas.push(AdminService.addInstitucion(obj));
                            $q.all(promesas)
                                .then(
                                    function(response){
                                        mensaje('success', 'Aviso.', 'Se dio de alta a la nueva institución correctamente.');
                                        scope.instituciones=response[0].data;
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
        
        function eliminarInstitucion(i){
            confirmaMsj(
                "Confirmación de solicitud",
                "¿Esta seguro de eliminar usuario? Esta es una acción permanente.",
                "Si",
                    function(){
                        var obj=i;
                        show();
                        var promesas=[];
                        promesas.push(AdminService.deleteInstitucion(obj));
                        $q.all(promesas)
                            .then(
                                function(response){
                                    mensaje('success', 'Aviso.', 'Se eliminó a la institución correctamente.');
                                    scope.instituciones=response[0].data;
                                    scope.cancelar();
                                    hide();
                                }
                            );
                    },
                "No",
                    function(){}
            );
        }
        
        function guardarUsuarioInstitucion(){
            if(true){
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
                            obj.tipo_usuario=2;
                            obj.id_institucion=scope.institucion.id_institucion;
                            obj.estatus=0;
                            show();
                            var promesas=[];
                            promesas.push(AdminService.addUser(obj));
                            $q.all(promesas)
                                .then(
                                    function(response){
                                        mensaje('success', 'Aviso.', 'Se dio de alta al nuevo usuario correctamente.');
                                        scope.listaUsuarios=response[0].data;
                                        scope.cancelar3();
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
                        obj.tipo_usuario=2;
                        show();
                        var promesas=[];
                        promesas.push(AdminService.deleteUser(obj));
                        $q.all(promesas)
                            .then(
                                function(response){
                                    mensaje('success', 'Aviso.', 'Se eliminó al usuario correctamente.');
                                    scope.listaUsuarios=response[0].data;
                                    scope.cancelar3();
                                    hide();
                                }
                            );
                    },
                "No",
                    function(){}
            );
        }
        
        function cancelar(){
            scope.institucion={};
            scope.nuevaInstitucion=true;
            scope.updateInstitucion=false;
            $("#modal_agregar_institucion").modal('hide');
        }
        
        function cancelar2(){
            scope.institucion={};
            scope.listaUsuarios=[];
            $("#modal_usuarios_institucion").modal('hide');
        }
        
        function cancelar3(){
            scope.usuario={};
            scope.validUser=false;
            scope.checkingUser=false;
            scope.NotvalidUser=false;
            $("#modal_agregar_institucion_usuario").modal('hide');
        }
        
    };//end controller

})();