(function () { 
    'use strict';
	
    angular
	.module('app.estudios')
	.controller('EstudiosVerController', EstudiosVerController);
    
    function EstudiosVerController (EstudiosService, $localStorage, $rootScope, $state, $mdDialog, $mdToast, DialogService, RestService, AuthenticationService, Constants, UserService) {
        /* jshint validthis: true */
        console.log('init estudios ver');
        
        //Check session
        AuthenticationService.isAuth();
        
        var scope = this;  
        
        scope.listaEstudios=[];
        scope.estudio={};
        scope.filtroFamilia="";
        
        scope.currentPage =0;
        scope.pageSize = 7;
        scope.numberOfPages = numberOfPages;
        
        //Banderas
        scope.load=false;
        scope.verAccion=false;
        
        //acctiones
        scope.buscarEstudios=buscarEstudios;
        scope.verDetalle=verDetalle;
       
       
        if (!$localStorage.globals||!$rootScope.isAuth) {
            mensaje('error', 'Session', 'Tu session ha expirado.');
            location.href='#/login';
        }
        
        scope.buscarEstudios();
        
        function buscarEstudios(){
            scope.bandera_busco=false;
            scope.load=true;
            EstudiosService.obtenerEstudios(
                    $rootScope.tipoUsuario,
                    $rootScope.rolUsuario,
                    $rootScope.user.id_usuario,
                    $rootScope.user.id_institucion,
                    scope.filtroFamilia
                    )
                .then(
                    function(response){
                        scope.load=false;
                        scope.listaEstudios=response.data;
                    },
                    function(error){
                        scope.load=false;
                        console.log('Error al obtener los estudios');
                    }
                );
            
        };
        
        function verDetalle(estudio){
            EstudiosService.estudioSeleccionado=estudio;
            window.location.href='#/estudios/detalle';
        };
        
        
        function numberOfPages(){
            return Math.ceil(scope.listaEstudios.length/scope.pageSize);  
        };
        
        
        
       
   
        
    };//end controller

})();