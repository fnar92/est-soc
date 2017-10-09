(function () { 
    'use strict';
	
    angular
	.module('app.admin')
	.controller('FamController', FamController);
    
    function FamController ($localStorage, AdminService, FamiliaService, $rootScope, $state, $mdDialog, $mdToast, DialogService, RestService, AuthenticationService, Constants, UserService) {
        /* jshint validthis: true */
        console.log('init FamController panel');
         var scope = this;  
         scope.user={};
         scope.institucion={};
         scope.familias=[];
         scope.familia={};
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
        
        scope.verActualizarFamilia=verActualizarFamilia;
        scope.eliminarFamilia=eliminarFamilia;
        scope.guardarFamilia=guardarFamilia;
        scope.cancelar=cancelar;
        
        AdminService.getFamilias().then(
                function(response){
                    scope.familias=response.data;
                },
        function (e){});
        
        function verActualizarFamilia(f){
            scope.familia=f;
            $("#modal_familia_update").modal('show');
        }
        
        function guardarFamilia(){
            confirmaMsj("Confirmación de solicitud",
                        "¿Actualizar información?",
                        "Si",
                        function(){
                            delete scope.familia.clave_institucion;
                            FamiliaService.actualizarFamilia(scope.familia).then(
                                        function(response){
                                            mensaje('success', 'Guardar información', 'Se han guardado los datos correctamente');
                                        },
                                function (e){
                                    mensaje('error', 'Guardar información', 'Ocurrio un error al guardar la información, intente mas tarde.');
                                });
                        },
                        "No",
                        function(){}
                    );
        }
        
        function eliminarFamilia(f){
            var data={};
            data.id_familia=f.id_familia;
            data.borrado='1';
            console.log(data);
            confirmaMsj("Confirmación de solicitud",
                        "¿Está seguro de eliminar a la familia?",
                        "Si",
                        function(){
                            
                            FamiliaService.actualizarFamilia(data).then(
                                        function(response){
                                            mensaje('success', 'Guardar información', 'Se han guardado los datos correctamente');
                                            window.location.reload();
                                        },
                                function (e){
                                    mensaje('error', 'Guardar información', 'Ocurrio un error al guardar la información, intente mas tarde.');
                                });
                        },
                        "No",
                        function(){}
                    );
        }
        
        function cancelar(){
            $("#modal_familia_update").modal('hide');
            scope.familia={};
        }
    };//end controller

})();