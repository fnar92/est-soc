(function () { 
    'use strict';
	
    angular
        .module('app.estudios')
        .factory('EstudiosCrearService', EstudiosCrearService );

    function EstudiosCrearService($http, RestService, $localStorage, $rootScope, Base64Service, Constants) {
        var service = {};
        service.user={};
        service.getUser=getUser;
        service.getInstitucion=getInstitucion;
        return service;
        
        function getUser(){
            console.log('buscando usuario');
            var id=$localStorage.globals.id;
            var type=$localStorage.globals.type;
            var url=Constants.BaseURLBack+'/user/getUser/'+id+'/'+type;
            return RestService.get(url,'');
        }
        
        function getInstitucion(id){
            console.log('buscando institucion service');
            var url=Constants.BaseURLBack+'/user/getInstitucion/'+id;
            return RestService.get(url,'');
        }
    }

})();
