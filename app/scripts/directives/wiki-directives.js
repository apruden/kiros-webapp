'use strict';


angular.module('kirosWebApp')
    .directive('article', [function () {
        return {
            restrict: 'E',
            scope: false,
            templateUrl: 'article.html'
        };
    }]);
