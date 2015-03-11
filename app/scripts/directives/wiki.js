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
}])
.directive('timeago', [function () {
    return {
        restrict: 'A',
        scope: {
            timeago: '='
        },
        link: function(scope, elem) {
            var d = new Date(scope.timeago);
            elem.html(Math.floor(Math.abs(new Date().getTime() - d.getTime())/1000./60./60./24.) + ' days ago');
        }
    };
}]);

