(function () { 
    'use strict';
	
    angular
        .module('app.estudios')
        .factory('DependienteService', DependienteService);

    function DependienteService($http, RestService, $localStorage, $rootScope, Base64Service, Constants) {
        var service = {};
        /*dependiente*/
        service.eliminarDependiente=eliminarDependiente;
        service.guardarDependiente=guardarDependiente;
        service.actualizarDependiente=actualizarDependiente;
        return service;
        /*dependiente*/
        function guardarDependiente(data){
            var url=Constants.BaseURLBack+'/estudio/saveDependiente';
            return RestService.post(url,'',data);
        }
        
        function eliminarDependiente(data){
            var url=Constants.BaseURLBack+'/estudio/deleteDependiente';
            return RestService.post(url,'',data);
        }
        
        function actualizarDependiente(data){
            var url=Constants.BaseURLBack+'/estudio/updateDependiente';
            return RestService.post(url,'',data);
        }
        
    }

})();
