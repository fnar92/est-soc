(function () { 
	'use strict';
	
        angular.module('app', [
            'ui.router',
            'ngMaterial', 
            'ngAnimate', 
            'ngStorage',
            'angularMoment',
            'moment-picker',
            'datatables',
            'ngResource',
            'app.authentication', 
            'app.home', 
			'app.dashboard',
            'app.utils'
        ]);
		
        angular.module('app.authentication', []);
		angular.module('app.dashboard', []);
        angular.module('app.home', ['ngMaterial']);
        angular.module('app.utils', []);
		
                
})();

/*Prueba cambio*/

var hide=function(){
    $("#loading").hide();
};

var show=function(){
    $("#loading").show();
};

var success=function(msg){
    $.notify(msg, 'success');
};

var info=function(msg){
    $.notify(msg, 'infp');
};

var warning=function(msg){
    $.notify(msg, 'warn');
};

var error=function(msg){
    $.notify(msg, 'error');
};