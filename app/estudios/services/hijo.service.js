(function () { 
    'use strict';
	
    angular
        .module('app.estudios')
        .factory('HijoService', HijoService);

    function HijoService($http, RestService, $localStorage, $rootScope, Base64Service, Constants) {
        var service = {};
        /*hijo*/
        service.eliminarHijo=eliminarHijo;
        service.guardarHijo=guardarHijo;
        service.actualizarHijo=actualizarHijo;
        
        return service;
        
        /*hijo*/
        function guardarHijo(data){
            var url=Constants.BaseURLBack+'/estudio/saveHijo';
            return RestService.post(url,'',data);
        }
        
        function eliminarHijo(data){
            var url=Constants.BaseURLBack+'/estudio/deleteHijo';
            return RestService.post(url,'',data);
        }
        
         function actualizarHijo(data){
            var url=Constants.BaseURLBack+'/estudio/updateHijo';
            return RestService.post(url,'',data);
        }
        
        
    }

})();
