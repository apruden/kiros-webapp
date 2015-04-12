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

.controller('ModalErrorCtrl', ['$scope', '$modalInstance', '$log','rejection', function($scope, $modalInstance, $log, rejection) {
    $scope.rejection = angular.copy(rejection, {});
    $log.error('Error in $http request: ', JSON.stringify($scope.rejection.config));
    delete $scope.rejection.config;

    $scope.ok = function() {
        $modalInstance.dismiss('ok');
    };
}])

.controller('HeaderCtrl', ['$scope', '$rootScope', '$location', '$localStorage', '$modal', function($scope, $rootScope, $location, $localStorage, $modal) {
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

  $rootScope.$on('error', function(ev, rejection) {
      $modal.open({
          templateUrl: 'views/error.html',
          controller: 'ModalErrorCtrl',
          resolve: {
              rejection: function () {
                  return rejection;
              }
          }
      });
  });

  $scope.q = '';

  $scope.search = function() {
      $location.path('/search').search('query', $scope.q);
  };

  $scope.clearSearch = function() {
      $scope.q = '';
  };
}]);
