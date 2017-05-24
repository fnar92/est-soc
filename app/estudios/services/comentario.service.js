(function () { 
    'use strict';
	
    angular
        .module('app.estudios')
        .factory('ComentarioService', ComentarioService);

    function ComentarioService($http, RestService, $localStorage, $rootScope, Base64Service, Constants) {
        var service = {};
        /*vehiculo*/
        service.eliminarComentario=eliminarComentario;
        service.guardarComentario=guardarComentario;
        service.actualizarComentario=actualizarComentario;
        
        return service;
        
        /*vehiculo*/
        function guardarComentario(data){
            var url=Constants.BaseURLBack+'/estudio/saveComentario';
            return RestService.post(url,'',data);
        }
        
        function eliminarComentario(data){
            var url=Constants.BaseURLBack+'/estudio/deleteComentario';
            return RestService.post(url,'',data);
        }
        
         function actualizarComentario(data){
            var url=Constants.BaseURLBack+'/estudio/updateComentario';
            return RestService.post(url,'',data);
        }
        
        
    }

})();
