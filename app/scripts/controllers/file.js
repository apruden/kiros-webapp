'use strict';

/**
 * @ngdoc function
 * @name kirosWebApp.controller:AboutCtrl
 * @description
 * Controller of the kirosWebApp
 */

angular.module('kirosWebApp')

.controller('FilesCtrl', ['$scope', 'Upload', 'Files', 'kirosConfig', function ($scope, Upload, Files, kirosConfig) {
  $scope.kirosConfig = kirosConfig;
  $scope.files = Files.query();
  $scope.disableAdd = false;
  $scope.progress = 0;

  $scope.upload = function (files) {
    $scope.disableAdd = true;
    files.forEach(function(file) {
      var progressHandler = function (evt) {
        $scope.progress = parseInt(100.0 * evt.loaded / evt.total);
      };

      var successHandler = function () {
        $scope.files = Files.query();
      };

      var errorHandler = function() {
      };

      var upload = Upload.upload({
        url: kirosConfig.files + '/files',
        file: file
      });

      upload.then(successHandler, errorHandler, progressHandler);
      upload.finally(function() {
        $scope.disableAdd = false;
        $scope.progress = 0;
      });

    });
  };
}]);
