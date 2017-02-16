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
        service.guardarDocumentos=guardarDocumentos;
        service.actualizarDocumentos=actualizarDocumentos;
        service.guardarEvaluacion=guardarEvaluacion;
        service.actualizarEvaluacion=actualizarEvaluacion;
        return service;
        
        function guardarEvaluacion(data){
            var url=Constants.BaseURLBack+'/estudio/saveEvaluacion';
            return RestService.post(url,'',data);
        }
        
        function actualizarEvaluacion(data){
            var url=Constants.BaseURLBack+'/estudio/updateEvaluacion';
            return RestService.post(url,'',data);
        }
        
        function guardarDocumentos(data){
            var url=Constants.BaseURLBack+'/estudio/saveDocumentos';
            return RestService.post(url,'',data);
        }
        
        function actualizarDocumentos(data){
            var url=Constants.BaseURLBack+'/estudio/updateDocumentos';
            return RestService.post(url,'',data);
        }

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
