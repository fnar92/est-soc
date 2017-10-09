(function () { 
    'use strict';
	
    angular
        .module('app.admin')
        .factory('AdminService', AdminService);

    function AdminService($http, RestService, $localStorage, $rootScope, Base64Service, Constants) {
        var service = {};
        service.getFamilias=getFamilias;
        service.getUserList=getUserList;
        service.addUser=addUser;
        service.updateUser=updateUser;
        service.deleteUser=deleteUser;
        
        service.getInstitucionList=getInstitucionList;
        service.addInstitucion=addInstitucion;
        service.updateInstitucion=updateInstitucion;
        service.deleteInstitucion=deleteInstitucion;
        
        service.getUsuariosInstitucionList=getUsuariosInstitucionList;
        service.updateCiclo=updateCiclo;
        
        return service;
        
        function getFamilias(){
            var url=Constants.BaseURLBack+'/admin/getFamiliasList';
            return RestService.get(url,'');
        }
        /*user*/
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
        
        /*institucion*/
        function getInstitucionList(){
            var url=Constants.BaseURLBack+'/admin/getInstitucionList';
            return RestService.get(url,'');
        }
        
        function getUsuariosInstitucionList(id){
            var url=Constants.BaseURLBack+'/admin/getUsuariosInstitucionList/'+id;
            return RestService.get(url,'');
        }
        
        function addInstitucion(data){
            var url=Constants.BaseURLBack+'/admin/addInstitucion';
            return RestService.post(url,'',data);
        }
        
        function updateInstitucion(data){
            var url=Constants.BaseURLBack+'/admin/updateInstitucion';
            return RestService.post(url,'',data);
        }
        
        function deleteInstitucion(data){
            var url=Constants.BaseURLBack+'/admin/deleteInstitucion';
            return RestService.post(url,'',data);
        }
        
        function updateCiclo(data){
            var url=Constants.BaseURLBack+'/admin/updateCiclo';
            return RestService.post(url,'',data);
        }
    }

})();
