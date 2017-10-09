(function () { 
    'use strict';
	
    angular
	.module('app.admin')
	.controller('CatController', CatController);
    
    function CatController ($localStorage, AdminService, EstudiosService, $rootScope, $state, $mdDialog, $mdToast, DialogService, RestService, AuthenticationService, Constants, UserService, $q) {
        /* jshint validthis: true */
        console.log('init CatController panel');
         var scope = this;  
         scope.user={};
         scope.institucion={};
        //Check session
        AuthenticationService.isAuth();
        if (!$localStorage.globals||!$rootScope.isAuth) {
            mensaje('error', 'Session', 'Tu session ha expirado.');
            location.href='#/login';
        }
        
        UserService.getUser().then(
            function(response){
                scope.user=$rootScope.user=response.data.usuario;
                if($rootScope.tipoUsuario==='2'){
                    scope.institucion=$rootScope.institucion=response.data.institucion;
                }
                hide();
            }, function(error){
                console.log('Error al guardar completar la solicitud: '+error);
            }
        );
        
        if($rootScope.tipoUsuario==='2'){
            if($rootScope.user.id_institucion===undefined){
                error();
                location.href='#/';
            }
        }
        
       
        
        hide();
        
        scope.listaCiclos=[];
        scope.listaCiclos1=[];
        EstudiosService.obtenerCicloEscolarCat().then(
            function(response){
                if(response.data.length>0){
                    scope.listaCiclos=response.data;
                        for (var i = 0; i < scope.listaCiclos.length; i++) {
                            if(scope.listaCiclos[i].status==='1'){
                                var o=scope.listaCiclos[i];
                                o.checked=true;
                                scope.listaCiclos1.push(o);
                                scope.listaCiclos[i].checked=true;
                            }else{
                                var o=scope.listaCiclos[i];
                                o.checked=false;
                                scope.listaCiclos1.push(o);
                                scope.listaCiclos[i].checked=false;
                            }
                        }
                }
            },function(error){
                console.log('Error al obtener el ciclo: '+error);
            }
        );
        
        scope.toggleSelection=toggleSelection;
        scope.update=update;
        
        function update(position, ciclos, c) {
            var data={};
            var promesas=[];
            angular.forEach(ciclos, function(c, index) {
                if (position !== index) {
                    c.checked = false;
                    var data={};
                    data.id_ciclo_escolar=c.id_ciclo_escolar;
                    data.status='0';
                    promesas.push(AdminService.updateCiclo(data));
                }else{
                    var data={};
                    data.id_ciclo_escolar=c.id_ciclo_escolar;
                    data.status='1';
                    promesas.push(AdminService.updateCiclo(data));
                }
            });
            
            if(!c.checked){
                data.id_ciclo_escolar=c.id_ciclo_escolar;
                data.status='0';
                promesas.push(AdminService.updateCiclo(data));
            }
            
            $q.all(promesas).then(
                    function(response){
                        console.log(response);
                    }
            );
        }
         
        function toggleSelection(id) {
            var idx = scope.listaCiclos.indexOf(id);

            // Is currently selected
            if (idx > -1) {
              scope.listaCiclos.splice(idx, 1);
            }

            // Is newly selected
            else {
              scope.listaCiclos.push(id);
            }
            console.log(id);
        };
    };//end controller

})();