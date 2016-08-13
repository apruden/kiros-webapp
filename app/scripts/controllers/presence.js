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
    return [d.getUTCFullYear(), d.getUTCMonth() + 1, d.getUTCDate()].join('-');
  }

  function add(d, days) {
    return new Date(d.getTime() + (days * 60 * 60 * 24 * 1000));
  }

  function substract(d, days) {
    return add(d, -days);
  }

  $scope.kirosConfig = kirosConfig;
  $scope.presence = Presence.query({q: 'timestamp:[' + shortDate(substract(now, 60)) + ' TO ' + shortDate(add(now, 1)) +']'});
}]);
