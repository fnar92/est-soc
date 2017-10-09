(function () { 
    'use strict';
	
    angular
        .module('app')
        .run(run);
    
    function run ($rootScope, $location, $http, $localStorage, UserService) {    
        console.log('init run app');
        $rootScope.user={};
        $rootScope.isAuth=false;
        $rootScope.dev=false;
        $rootScope.tipoUsuario=0;
        $rootScope.rolUsuario=0;
        $rootScope.institucion={};
        $rootScope.isLocal=false;
        $rootScope.idEstudioReporte=0;
        $rootScope.idUser=0;
		
        if ($localStorage.globals) {
            $rootScope.isAuth=true;
            $rootScope.tipoUsuario=$localStorage.globals.type;
            $rootScope.rolUsuario=$localStorage.globals.role;
            $rootScope.idUser=$localStorage.globals.id;
            $http.defaults.headers.common['Authorization'] = 'Basic ' + $localStorage.globals.authdata;
            UserService.loadUser();
        }
        
        $rootScope.$on('$locationChangeStart', function (event, next, current) {
            if($location.path() !== '/login' && !$localStorage.globals){
                $location.path('/login');
            }
        });
		
			
    }

})();