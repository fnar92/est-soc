(function () { 
    'use strict';
	
    angular
        .module('app.estudios')
        .factory('PropiedadService', PropiedadService);

    function PropiedadService($http, RestService, $localStorage, $rootScope, Base64Service, Constants) {
        var service = {};
        /*vehiculo*/
        service.eliminarPropiedad=eliminarPropiedad;
        service.guardarPropiedad=guardarPropiedad;
        service.actualizarPropiedad=actualizarPropiedad;
        
        return service;
        
        /*vehiculo*/
        function guardarPropiedad(data){
            var url=Constants.BaseURLBack+'/estudio/savePropiedad';
            return RestService.post(url,'',data);
        }
        
        function eliminarPropiedad(data){
            var url=Constants.BaseURLBack+'/estudio/deletePropiedad';
            return RestService.post(url,'',data);
        }
        
         function actualizarPropiedad(data){
            var url=Constants.BaseURLBack+'/estudio/updatePropiedad';
            return RestService.post(url,'',data);
        }
        
        
    }

})();
