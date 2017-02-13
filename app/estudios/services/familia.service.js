(function () { 
    'use strict';
	
    angular
        .module('app.estudios')
        .factory('FamiliaService', FamiliaService);

    function FamiliaService($http, RestService, $localStorage, $rootScope, Base64Service, Constants) {
        var service = {};
        service.actualizarFamilia=actualizarFamilia;
        service.guardarPapa=guardarPapa;
        service.actualizarPapa=actualizarPapa;
        service.guardarIngresos=guardarIngresos;
        service.actualizarIngresos=actualizarIngresos;
        service.guardarEgresos=guardarEgresos;
        service.actualizarEgresos=actualizarEgresos;
        return service;
        
        function guardarEgresos(data){
            var url=Constants.BaseURLBack+'/estudio/saveEgresos';
            return RestService.post(url,'',data);
        }
        
        function actualizarEgresos(data){
            var url=Constants.BaseURLBack+'/estudio/updateEgresos';
            return RestService.post(url,'',data);
        }
        
        function guardarPapa(data){
            var url=Constants.BaseURLBack+'/estudio/savePapa';
            return RestService.post(url,'',data);
        }
        
        function actualizarPapa(data){
            var url=Constants.BaseURLBack+'/estudio/updatePapa';
            return RestService.post(url,'',data);
        }
        
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
