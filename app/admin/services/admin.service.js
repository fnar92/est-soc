(function () { 
    'use strict';
	
    angular
        .module('app.admin')
        .factory('AdminService', AdminService);

    function AdminService($http, RestService, $localStorage, $rootScope, Base64Service, Constants) {
        var service = {};
        /*vehiculo*/
        service.getUserList=getUserList;
        service.addUser=addUser;
        service.updateUser=updateUser;
        service.deleteUser=deleteUser;
        
        return service;
        
        /*vehiculo*/
        function getUserList(tipoUsuario, id){
            var url=Constants.BaseURLBack+'/admin/getUserList/'+tipoUsuario+'/'+id;
            return RestService.get(url,'');
        }
        
        function addUser(data){
            var url=Constants.BaseURLBack+'/admin/addUser';
            return RestService.post(url,'',data);
        }
        
        function updateUser(data){
            var url=Constants.BaseURLBack+'/admin/updateUser';
            return RestService.post(url,'',data);
        }
        
        function deleteUser(data){
            var url=Constants.BaseURLBack+'/admin/deleteUser';
            return RestService.post(url,'',data);
        }
        
    }

})();
