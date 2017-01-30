/**
 * Description:
 *     removes white space from text. useful for html values that cannot have spaces
 * Usage:
 *   {{some_text | nospace}}
 */
angular.module('app').filter('nospace', function () {
    return function (value) {
        return (!value) ? '' : value.replace(/ /g, '');
    };
}).filter('fecha', function () {
    return function (x) {
        var meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
        if(x !== null){
            var date = new Date(x);
            return date.getUTCDate() + "/" + meses[date.getUTCMonth()] + "/" + date.getUTCFullYear();
        }else{
            return "";
        }
        
    };
});
angular
        .module('app')
        .filter('startFrom', 
        function() {
            return function(input, start) {
                    start = +start; //parse to int
                    return input.slice(start);
                };
            });
/* Diretivas */
angular.module('app').directive("resize", function () {
    return function (scope, element, attrs) {
        element.bind("mousedown", function () {
            scope.resize(element);
            scope.$apply();
        });
    };
}).directive("remove", function () {
    return function (scope, element, attrs) {
        element.bind("mousedown", function () {
            scope.remove(element);
            scope.$apply();
        });
    };
}).directive('fileModel', ['$parse', function ($parse) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                var model = $parse(attrs.fileModel);
                var modelSetter = model.assign;

                element.bind('change', function () {
                    scope.$apply(function () {
                        modelSetter(scope, element[0].files[0]);
                    });
                });
            }
        };
    }]);


