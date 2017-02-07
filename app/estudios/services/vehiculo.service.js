(function () { 
    'use strict';
	
    angular
        .module('app.estudios')
        .factory('VehiculoService', VehiculoService);

    function VehiculoService($http, RestService, $localStorage, $rootScope, Base64Service, Constants) {
        var service = {};
        /*vehiculo*/
        service.eliminarVehiculo=eliminarVehiculo;
        service.guardarVehiculo=guardarVehiculo;
        service.actualizarVehiculo=actualizarVehiculo;
        
        return service;
        
        /*vehiculo*/
        function guardarVehiculo(data){
            var url=Constants.BaseURLBack+'/estudio/saveVehiculo';
            return RestService.post(url,'',data);
        }
        
        function eliminarVehiculo(data){
            var url=Constants.BaseURLBack+'/estudio/deleteVehiculo';
            return RestService.post(url,'',data);
        }
        
         function actualizarVehiculo(data){
            var url=Constants.BaseURLBack+'/estudio/updateVehiculo';
            return RestService.post(url,'',data);
        }
        
        
    }

})();
