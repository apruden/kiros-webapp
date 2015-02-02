'use strict';

/**
 * @ngdoc function
 * @name kirosWebApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the kirosWebApp
 */
angular.module('kirosWebApp')
  .controller('MainCtrl', ['$scope', '$location', '$localStorage', function ($scope, $location, $localStorage) {
      debugger;

      if ($location.search().access_token) {
          console.log('Saving access token');
          $localStorage.accessToken = $location.search().access_token;
      }

  }]);
