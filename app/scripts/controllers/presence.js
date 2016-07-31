'use strict';

/**
 * @ngdoc function
 * @name kirosWebApp.controller:AboutCtrl
 * @description
 * Controller of the kirosWebApp
 */

angular.module('kirosWebApp')

.controller('PresenceCtrl', ['$scope', 'Presence', 'kirosConfig', function ($scope, Presence, kirosConfig) {
  var now = new Date();

  function shortDate(d) {
    return [d.getFullYear(), d.getMonth() + 1, d.getDate()].join('-');
  }

  function substract(d, days) {
    return new Date(d.getTime() - (days * 60 * 60 * 24 * 1000));
  }

  $scope.kirosConfig = kirosConfig;
  $scope.presence = Presence.query({q: 'timestamp:[' + shortDate(substract(now, 60)) + ' TO ' + shortDate(now) +']'});
}]);
