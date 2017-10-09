(function () { 
    'use strict';
        
    angular
        .module('app')
        .constant('Constants', {
            /*
            //dev
            BaseURLBack : 'http://fnar.com:8087/est-soc/api',
            BaseURLFront : 'http://fnar.com:8087/est-soc/#/'
            */
        
            /*
            //local
            BaseURLBack : 'http://hrwise.local/est-soc/api',
            BaseURLFront : 'http://hrwise.local/est-soc/#/'
            */
        
            //prod
            BaseURLBack : 'http://www.hrwise.com.mx/est-soc/api',
            BaseURLFront : 'http://www.hrwise.com.mx/est-soc/#/'
            
        });
        
})();
