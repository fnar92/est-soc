(function () { 
    'use strict';
	
    angular
        .module('app.estudios')
        .factory('FamiliaService', FamiliaService);

    function FamiliaService($http, RestService, $localStorage, $rootScope, Base64Service, Constants) {
        var service = {};
        service.actualizarFamilia=actualizarFamilia;
        
        return service;
        
        function actualizarFamilia(data){
            var url=Constants.BaseURLBack+'/estudio/updateFamilia';
            return RestService.post(url,'',data);
        }
        
        
        
    }

})();
