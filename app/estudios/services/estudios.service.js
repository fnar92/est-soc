(function () { 
    'use strict';
	
    angular
        .module('app.estudios')
        .factory('EstudiosService', EstudiosService);

    function EstudiosService($http, RestService, $localStorage, $rootScope, Base64Service, Constants) {
        var service = {};
        service.idEstudioSeleccionado=0;
        service.obtenerEmpleados=obtenerEmpleados;
        service.guardarAsignado=guardarAsignado;
        service.obtenerFamilias=obtenerFamilias;
        service.guardarFamilia=guardarFamilia;
        service.guardarEstudio=guardarEstudio;
        service.obtenerEstudios=obtenerEstudios;
        service.guardarEstudioInstitucion=guardarEstudioInstitucion;
        service.obtenerDetalleEstudio=obtenerDetalleEstudio;
        service.actualizarEstudio=actualizarEstudio;
        service.cancelarEstudioInstitucion=cancelarEstudioInstitucion;
        
        return service;
        
        function cancelarEstudioInstitucion(idCancelacion){
            var url=Constants.BaseURLBack+'/estudio/cancelEstudioInstitucion/'+idCancelacion;
            return RestService.get(url,'');
        }
        
        function obtenerEmpleados(){
            var url=Constants.BaseURLBack+'/user/getEmpleados';
            return RestService.get(url,'');
        }
        
        function actualizarEstudio(data){
            var url=Constants.BaseURLBack+'/estudio/updateEstudio';
            return RestService.post(url,'',data);
        }
        
        function guardarAsignado(data){
            var url=Constants.BaseURLBack+'/estudio/updateEstudio';
            return RestService.post(url,'',data);
        }
        
        function obtenerFamilias(idInstitucion, filterFamilia){
            if(filterFamilia===undefined|| filterFamilia===''){
                filterFamilia='all';
            }
            var url=Constants.BaseURLBack+'/estudio/getFamilias/'+idInstitucion+'/'+filterFamilia;
            return RestService.get(url,'');
        }
        
        function guardarFamilia(data){
            var url=Constants.BaseURLBack+'/estudio/saveFamilia';
            return RestService.post(url,'',data);
        }
        
        function guardarEstudioInstitucion(data){
            var url=Constants.BaseURLBack+'/estudio/saveEstudioInstitucion';
            return RestService.post(url,'',data);
        }
        
        function guardarEstudio(data){
            var url=Constants.BaseURLBack+'/estudio/saveEstudio';
            return RestService.post(url,'',data);
        }
        
        function obtenerEstudios(tipoUsuario, rolUsuario, idUsuario, idInstitucion, filterFamilia){
            if(filterFamilia===undefined|| filterFamilia===''){
                filterFamilia='all';
            }
            var url=Constants.BaseURLBack+'/estudio/getEstudios/'+tipoUsuario+'/'+rolUsuario+'/'+idUsuario+'/'+idInstitucion+'/'+filterFamilia;
            return RestService.get(url,'');
        }
        
        function obtenerDetalleEstudio(idEstudio){
            var url=Constants.BaseURLBack+'/estudio/getEstudioDetalle/'+idEstudio;
            return RestService.get(url,'');
        }
        
        
    }

})();
