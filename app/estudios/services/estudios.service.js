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
        service.obtenerCicloEscolar=obtenerCicloEscolar;
        service.obtenerCicloEscolarCat=obtenerCicloEscolarCat;
        service.obtenerEstatusCat=obtenerEstatusCat;
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
        
        function obtenerFamilias(data){
            var url=Constants.BaseURLBack+'/estudio/getFamilias';
            return RestService.post(url,'', data);
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
        
        function obtenerEstudios(params){
            if(params.filtroFamilia===undefined|| params.filtroFamilia===''){
                params.filtroFamilia='all';
            }
            if(params.idInstitucion===undefined|| params.idInstitucion===''){
                params.idInstitucion='0';
            }
            var url=Constants.BaseURLBack+'/estudio/getEstudios';
            return RestService.post(url,'', params);
        }
        
        function obtenerDetalleEstudio(idEstudio, idInstitucion){
            var url=Constants.BaseURLBack+'/estudio/getEstudioDetalle/'+idEstudio+'/'+idInstitucion;
            return RestService.get(url,'');
        }
        
        function obtenerCicloEscolar(){
            var url=Constants.BaseURLBack+'/estudio/getCicloEscolar';
            return RestService.get(url,'');
        }
        
        function obtenerCicloEscolarCat(){
            var url=Constants.BaseURLBack+'/estudio/getCicloEscolarCat';
            return RestService.get(url,'');
        }
        
        function obtenerEstatusCat(){
            var url=Constants.BaseURLBack+'/estudio/getEstatusCat';
            return RestService.get(url,'');
        }
        
    }

})();
