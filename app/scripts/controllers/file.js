'use strict';

/**
 * @ngdoc function
 * @name kirosWebApp.controller:AboutCtrl
 * @description
 * Controller of the kirosWebApp
 */

angular.module('kirosWebApp')

.controller('FilesCtrl', ['$scope', '$location', '$localStorage', 'Files', function ($scope, $location, $localStorage, Files) {
    $scope.showActions = function(a) {
        a.showActions = true;
    };

    $scope.hideActions = function(a) {
        a.showActions = false;
    };

    $scope.files = Files.query();

    $scope.loadMore = function() {
        $scope.offset = $scope.files.length;
        Files.query({offset: $scope.offset}, function(res) {
            $scope.offset += res.length;
            res.forEach(function(r) {
                $scope.files.push(r);
            });
        });
    };

    $scope.addFile = function() {
        console.log('edit file');
        $location.path('/files/edit');
    };

    $scope.editFile = function (a) {
        console.log('edit file ' + a.id);
        $location.path('/files/' + a.id + '/edit');
    };
}]);
