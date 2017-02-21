(function () { 
    'use strict';
	
    angular
	.module('app.dashboard')
	.controller('DashboardController', DashboardController);
    
    function DashboardController ($localStorage, $rootScope, $state, $mdDialog, $mdToast, DialogService, RestService, AuthenticationService, Constants, UserService) {
        /* jshint validthis: true */
        console.log('init dashboard');
        
        //Check session
        AuthenticationService.isAuth();
        console.log('auth: '+$rootScope.isAuth);
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
            console.log($localStorage.globals);
            $rootScope.isAuth=true;
            $rootScope.tipoUsuario=$localStorage.globals.type;
            $rootScope.rolUsuario=$localStorage.globals.role;
        }
        
        if($rootScope.isAuth){
            console.log('entro a buscar');
            show();
            UserService.getUser().then(
                function(response){
                    console.log('se obtuvo el usuario');
                    $rootScope.user=response.data;
                    scope.user=response.data;
                    $rootScope.user=response.data;
                    if(response.data.id_institucion!==undefined){
                        show();
                        UserService.getInstitucion(response.data.id_institucion).then(
                            function(response){
                                console.log('se obtuvo la institucion');
                                scope.institucion=response.data;
                                $rootScope.institucion=response.data;
                                hide();
                            }, function(){
                                console.log('Error al obtener la institucion');
                                error();
                            }
                        );
                    }else{
                        hide();
                    }
                    
                }, function(){
                    console.log('Error al obtener el usuario');
                    error();
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
            show();
            RestService.get(Constants.BaseURLBack+'/pull.php', '').then(
                function(response){
                    hide();
                    mensaje('success', 'Importar datos.', 'Los datos se importaron correctamente, se actualizara el sistema, espere...',6000);
                    setTimeout(function(){window.location.reload(true);}, 6000);
                },
                function(error){
                    hide();
                    mensaje('error', 'Importar datos.', 'Ocurrio un error al importar los datos desde el servidor.');
                    console.log('Error pull: '+error);
                }
            );
        }
       
        function push(){
            show();
            RestService.get(Constants.BaseURLBack+'/push.php', '').then(
                function(response){
                    hide();
                    mensaje('success', 'Exportar datos.', 'Los datos se exportaron correctamente, verifíquelos en el servidor.',6000);
                    setTimeout(function(){window.location.reload(true);}, 6000);
                },
                function(error){
                    hide();
                    mensaje('error', 'Importar datos.', 'Ocurrio un error al importar los datos desde el servidor.');
                    console.log('Error pull: '+error);
                }
            );
        } 
       
            
    function logout(ev) {
        console.log('salir');
        var quest= '¿Salir del sistema?';
        var confirm = DialogService.dialogConfirm(ev,'Confirmación', quest,'Si','No');
        $mdDialog.show(confirm).then(function() {
            RestService.get(Constants.BaseURLBack + '/auth/logout','','');  
            AuthenticationService.ClearCredentials();
            $rootScope.isAuth=false;
            $rootScope.user={};
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