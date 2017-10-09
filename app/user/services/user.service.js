(function () { 
    'use strict';
	
    angular
        .module('app.authentication')
        .factory('UserService', UserService );

    function UserService($http, RestService, $localStorage, $rootScope, Base64Service, Constants, $q) {
        var service = {};
        service.user={};
        service.institucion={};
        service.getUser=getUser;
        service.getInstitucion=getInstitucion;
        service.updateUser=updateUser;
        service.loadUser=loadUser;
        service.checkUser=checkUser;
        return service;
        
        function loadUser(){
            if($rootScope.isAuth){
                console.log('cargando datos usuario');
                var type=$localStorage.globals.type;
                service.getUser().then(
                    function(response){
                        service.user=$rootScope.user=response.data.usuario;
                        if(type==='2'){
                            service.institucion=$rootScope.institucion=response.data.institucion;
                        }
                        hide();
                    }, function(error){
                        console.log('Error al guardar completar la solicitud: '+error);
                    }
                );
                
            }
        }
        function getUser(){
            var id=$localStorage.globals.id;
            var type=$localStorage.globals.type;
            var url=Constants.BaseURLBack+'/user/getUser/'+id+'/'+type;
            return RestService.get(url,'');
        }
        
        function getInstitucion(id){
            var url=Constants.BaseURLBack+'/user/getInstitucion/'+id;
            return RestService.get(url,'');
        }
        
        function updateUser(data){
            var url=Constants.BaseURLBack+'/user/updateUser';
            return RestService.post(url,'',data);
        }
        
        function checkUser(data){
            var url=Constants.BaseURLBack+'/user/checkUser';
            return RestService.post(url,'',data);
        }
    }

})();
