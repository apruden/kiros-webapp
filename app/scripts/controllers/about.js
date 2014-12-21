'use strict';

/**
 * @ngdoc function
 * @name kirosWebappApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the kirosWebappApp
 */
angular.module('kirosWebappApp')
  .controller('AboutCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
