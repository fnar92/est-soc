(function () { 
    'use strict';
	
    angular
        .module('app.estudios')
        .factory('FamiliaService', FamiliaService);

    function FamiliaService($http, RestService, $localStorage, $rootScope, Base64Service, Constants) {
        var service = {};
        service.actualizarFamilia=actualizarFamilia;
        service.guardarIngresos=guardarIngresos;
        service.actualizarIngresos=actualizarIngresos;
        return service;
        
        function actualizarFamilia(data){
            var url=Constants.BaseURLBack+'/estudio/updateFamilia';
            return RestService.post(url,'',data);
        }
        
        function guardarIngresos(data){
            var url=Constants.BaseURLBack+'/estudio/saveIngresos';
            return RestService.post(url,'',data);
        }
        
        function actualizarIngresos(data){
            var url=Constants.BaseURLBack+'/estudio/updateIngresos';
            return RestService.post(url,'',data);
        }
        
        
    }

})();
