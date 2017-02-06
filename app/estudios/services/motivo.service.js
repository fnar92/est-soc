(function () { 
    'use strict';
	
    angular
        .module('app.estudios')
        .factory('MotivoService', MotivoService);

    function MotivoService($http, RestService, $localStorage, $rootScope, Base64Service, Constants) {
        var service = {};
        /*dependiente*/
        service.eliminarMotivo=eliminarMotivo;
        service.guardarMotivo=guardarMotivo;
        service.actualizarMotivo=actualizarMotivo;
        return service;
        /*dependiente*/
        function guardarMotivo(data){
            var url=Constants.BaseURLBack+'/estudio/saveMotivo';
            return RestService.post(url,'',data);
        }
        
        function eliminarMotivo(data){
            var url=Constants.BaseURLBack+'/estudio/deleteMotivo';
            return RestService.post(url,'',data);
        }
        
        function actualizarMotivo(data){
            var url=Constants.BaseURLBack+'/estudio/updateMotivo';
            return RestService.post(url,'',data);
        }
        
    }

})();
