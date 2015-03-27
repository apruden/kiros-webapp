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

  if ($location.search().access_token) {
      console.log('Saving access token');
      $localStorage.accessToken = $location.search().access_token;
  }

}])

.controller('HeaderCtrl', ['$scope', '$rootScope', '$location', '$localStorage', function($scope, $rootScope, $location, $localStorage) {
  $scope.authorized = $localStorage.accessToken ? true : false;
  $scope.username = $localStorage.user ? $localStorage.user.username : '';

  $scope.$on('authenticated', function(sender, user) {
      if (user) {
        $scope.authorized = true;
        $scope.username = user.username;
      } else {
          $scope.authorized = false;
        $scope.username = '';
      }
  });

  $rootScope.$on('$routeChangeStart', function(ev, next){
      if (next && next.$$route) {
          if (!$localStorage.accessToken) {
              $location.path('/login');
          }
      }
  });

  $scope.q = '';

  $scope.search = function() {
      $location.path('/search').search('query', $scope.q);
  };
}]);
