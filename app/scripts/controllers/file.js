'use strict';

/**
 * @ngdoc function
 * @name kirosWebApp.controller:AboutCtrl
 * @description
 * Controller of the kirosWebApp
 */

angular.module('kirosWebApp')

.controller('FilesCtrl', ['$scope', 'Files', function ($scope, Files) {
    $scope.files = Files.query();
}]);
