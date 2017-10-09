(function () { 
    'use strict';
	
    angular
	.module('app.dashboard')
	.controller('DashboardController', DashboardController);
    
    function DashboardController ($localStorage, $rootScope, $state, $mdDialog, $mdToast, DialogService, RestService, AuthenticationService, Constants, UserService, $q) {
        /* jshint validthis: true */
        console.log('init dashboard');
        
        //Check session
        AuthenticationService.isAuth();
        var scope = this;  
        scope.user={};
        scope.tipoUsuario=0;
        scope.rolUsuario=0;
        scope.institucion={};
        
        //functions
        scope.logout = logout;
        scope.pull=pull;
        scope.push=push;
        
        if ($localStorage.globals) {
            $rootScope.isAuth=true;
            $rootScope.tipoUsuario=$localStorage.globals.type;
            $rootScope.rolUsuario=$localStorage.globals.role;
            
            UserService.getUser().then(
                function(response){
                    scope.user=$rootScope.user=response.data.usuario;
                    if($rootScope.tipoUsuario==='2'){
                        scope.institucion=$rootScope.institucion=response.data.institucion;
                    }
                    hide();
                }, function(error){
                    console.log('Error al completar la solicitud: '+error);
                }
            );
        }
        
         /*$mdDialog.show({
                templateUrl: 'app/login/views/login.tpl.html',
                parent: angular.element(document.body),
                targetEvent: null,
                clickOutsideToClose:true,
                fullscreen: scope.customFullscreen
            });         
        */
       
        function pull(){
            confirmaMsj(
                "Confirmación de solicitud",
                "¿Esta seguro de importrar los datos desde el servidor? Esta acción crea una replica de la base de datos del servidor, si tiene estudios sin finalizar captura NO realice esta acción, primero termine su captura y luego EXPORTE al servidor.",
                "Si",
                    function(){
                        show();
                        RestService.get(Constants.BaseURLBack+'/pull.php', '').then(
                            function(response){
                                
                                mensaje('success', 'Importar datos.', 'Los datos se importaron correctamente, se actualizara el sistema, espere...',5000);
                                setTimeout(function(){hide(); window.location.reload(true);}, 6000);
                            },
                            function(error){
                                hide();
                                mensaje('error', 'Importar datos.', 'Ocurrio un error al importar los datos desde el servidor.');
                                console.log('Error pull: '+error);
                            }
                        );
                    },
                "No",
                    function(){}
            );
            
        }
       
        function push(){
            confirmaMsj(
                "Confirmación de solicitud",
                "¿Esta seguro de exportrar sus datos al servidor? Esta acción envia al servidor aquellos estudios que ya fueron capturados y/o enviados a revisión.",
                "Si",
                    function(){
                        show();
                        var promesas=[];
                        promesas.push(RestService.get(Constants.BaseURLBack+'/sync', ''));
                        promesas.push(RestService.get(Constants.BaseURLBack+'/pull.php', ''));

                        $q.all(promesas).then(
                            function(response){
                                
                                mensaje('success', 'Exportar datos.', 'Los datos se exportaron correctamente, verifíquelos en el servidor. <br> Se actualizara el sistema, espere...',6000);
                                setTimeout(function(){hide();window.location.reload(true);}, 5000);
                            }, 
                            function (error){
                                hide();
                                mensaje('error', 'Importar datos.', 'Ocurrio un error al importar los datos desde el servidor.');
                                console.log('Error pull: '+error);
                            }
                        );
                    },
                "No",
                    function(){}
            );
    
        } 
       
       
            
        function logout(ev) {
            console.log('salir');
            var quest= '¿Salir del sistema?';
            var confirm = DialogService.dialogConfirm(ev,'Confirmación', quest,'Si','No');
            $mdDialog.show(confirm).then(function() {
                RestService.get(Constants.BaseURLBack + '/auth/logout','','');  
                AuthenticationService.ClearCredentials();
                $rootScope.user={};
                $rootScope.isAuth=false;
                $rootScope.dev=false;
                $rootScope.tipoUsuario=0;
                $rootScope.rolUsuario=0;
                $rootScope.institucion={};
                $rootScope.isLocal=false;
                $rootScope.idEstudioReporte=0;
                $rootScope.idUser=0;
                window.location.href='#/login';
                 //window.location.reload();
                //$state.go('/home');
            }, function() {
                $mdDialog.hide();
            });      
        }
        
        /*
        function login() {
            scope.dataLoading = true;
            var objParams = {"username":scope.username, "password":scope.password };
            var url = Constants.BaseURLBack + '/login';
            
            RestService.post(url,'',objParams)
            .then(function(data) {
                if(data.status===200){
                    var urDefault = {"id":data.headers('idUnidadResponsable'), "defaultUR": data.headers('descripcionUR')};
                    AuthenticationService.SetCredentials(scope.username, scope.password, data.headers('perfiles'), data.headers('username'), data.headers('fase'), urDefault);
                    var total = data.headers('perfiles').split(",");
                    var patt = /1/;
                    if(patt.test(total.length)){ //one rol
                        $state.go('home.configuration-ur');
                    }else{
                        showProfile();
                    }
                }
            })
            .catch(function(err){
                scope.error = 'El usuario y/o contrase�a son incorrectos, favor de verificar los datos.';
                scope.dataLoading = false;
            });
            
        }

        function showProfile(ev) {
            $mdDialog.show({
                templateUrl: 'app/tools/main/views/select-perfil.tpl.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose:false,
                fullscreen: scope.customFullscreen
            });           
        }        */
    };

})();