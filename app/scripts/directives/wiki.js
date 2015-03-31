'use strict';

angular.module('kirosWebApp')

.directive('marked', [function () {
    return {
        restrict: 'A',
        scope: {
            marked: '='
        },
        link: function(scope, elem) {
            if (!scope.marked) {
                scope.marked = '';
            }

            scope.$watch('marked', function(val) {
                elem.html(marked(val));
            });

            elem.html(marked(scope.marked));
        }
    };
}])

.directive('timeago', [function () {
    var temp = {s: 1.0, m: 60.0, h:60.0, d:24.0, M:30.0, y:365.0};

    return {
        restrict: 'A',
        scope: {
            timeago: '='
        },
        link: function(scope, elem) {
            var d = new Date(scope.timeago),
                unit = 's',
                val = Math.floor(Math.abs(new Date().getTime() - d.getTime())/1000.0);

            for(var u in temp) {
                var i = val / temp[u];

                if (i < 1) {
                    break;
                }

                val = i;
                unit = u;
            }

            elem.html('-' + Math.floor(val) + unit);
        }
    };
}])

.directive('comments', [function() {
    return {
        restrict: 'E',
        scope: {
            comments: '=',
            targetType: '@',
            targetId: '='
        },
        controller: 'CommentsCtrl',
        templateUrl: 'views/comments.html'
    };
}]);
