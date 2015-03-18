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
  .controller('HeaderCtrl', ['$scope', '$rootScope', '$location', '$localStorage', 'Search', 'SearchResult', function($scope, $rootScope, $location, $localStorage, Search, SearchResult) {
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

      $rootScope.$on('$routeChangeStart', function(ev, next, curr){
          if (next && next.$$route) {
              if (!$localStorage.accessToken) {
                  $location.path('/login');
              }
          }
      });

      $scope.narticles = 0;
      $scope.nreports = 0;
      $scope.q = '';

      $scope.search = function() {
          Search.get({query: $scope.q}, function(r) {
              $scope.narticles = r.articles.length;
              $scope.nreports = r.reports.length;
              SearchResult.setCurrent(r);
              $rootScope.$broadcast('searchResult', r);
          });
      };

      $scope.clearSearch = function() {
          $scope.narticles = 0;
          $scope.nreports = 0;
          $scope.q = '';
          SearchResult.setCurrent({});
          $rootScope.$broadcast('clearSearchResult', {});
      };
  }]);
