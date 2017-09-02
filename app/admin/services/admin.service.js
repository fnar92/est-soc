(function () { 
    'use strict';
	
    angular
        .module('app.admin')
        .factory('AdminService', AdminService);

    function AdminService($http, RestService, $localStorage, $rootScope, Base64Service, Constants) {
        var service = {};
        /*vehiculo*/
        service.getUserList=getUserList;
        
        return service;
        
        /*vehiculo*/
        function getUserList(tipoUsuario, id){
            var url=Constants.BaseURLBack+'/admin/getUserList/'+tipoUsuario+'/'+id;
            return RestService.get(url,'');
        }
        
    }

})();
