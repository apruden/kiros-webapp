'use strict';

angular.module('kirosWebApp')
  .controller('SearchCtrl', ['$scope', '$location', '$localStorage', 'Search', function ($scope, $location, $localStorage, Search) {
      $scope.articles = [];
      $scope.reports = [];
      $scope.hasResults = true;
      $scope.q = $location.search().query;

      if ($location.search().query) {
          Search.get({query: $location.search().query}, function(r) {
              if (!r.articles.length && !r.reports.length) {
                $scope.hasResults = false;
              }

              $scope.articles = r.articles;
              $scope.reports = r.reports;
          });
      }
}]);
