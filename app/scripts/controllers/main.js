'use strict';

/**
 * @ngdoc function
 * @name kirosWebappApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the kirosWebappApp
 */
angular.module('kirosWebappApp')
  .controller('MainCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
