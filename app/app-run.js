(function () { 
    'use strict';
	
    angular
        .module('app')
        .run(run);
    
    function run ($rootScope, $location, $http, $localStorage) {    
        console.log('init run app');
        $rootScope.user={};
        $rootScope.isAuth=false;
		$rootScope.tipoUsuario=0;
		$rootScope.rolUsuario=0;
		
        if ($localStorage.globals) {
			$rootScope.isAuth=true;
			$rootScope.tipoUsuario=$localStorage.globals.type;
			$rootScope.rolUsuario=$localStorage.globals.role;
            $http.defaults.headers.common['Authorization'] = 'Basic ' + $localStorage.globals.authdata;
        }
        
        $rootScope.$on('$locationChangeStart', function (event, next, current) {
            if($location.path() !== '/login' && !$localStorage.globals){
                $location.path('/login');
            }
        });
		
			
    }

})();