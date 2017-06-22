(function () { 
    'use strict';
        
    angular
        .module('app')
        .constant('Constants', {
            BaseURLBack : 'http://mx-fn.local:8087/est-soc/api',
            BaseURLFront : 'http://mx-fn.local:8087/est-soc/#/'
        });
        
})();
