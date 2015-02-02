'use strict';

angular.module('kirosWebApp')
.directive('marked', [function () {
    return {
        restrict: 'A',
    scope: {
        marked: '='
    },
    link: function(scope, elem) {
        elem.html(marked(scope.marked));
    }
    };
}]);
