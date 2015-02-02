'use strict';

/**
 * @ngdoc function
 * @name kirosWebApp.controller:AboutCtrl
 * @description
 * # WikiCtrl
 * Controller of the kirosWebApp
 */

angular.module('kirosWebApp')

.controller('WikiCtrl', ['$scope', '$location', '$localStorage', 'Articles', function ($scope, $location, $localStorage, Articles) {
    if ($location.search().access_token) {
        console.log('Saving access token');
        $localStorage.accessToken = $location.search().access_token;
        $location.search({});
    }

    $scope.articles = Articles.query();

    $scope.editArticle = function () {
        console.log('edit article');
    };
}])

.controller('ArticleEditCtrl',['$scope', '$routeParams', 'Articles', function($scope, $routeParams, Articles) {
    $scope.article = Articles.get({id: $routeParams.id});
}])

.controller('ArticleCtrl',['$scope', '$routeParams', 'Articles', function($scope, $routeParams, Articles) {
    $scope.article = Articles.get({id: $routeParams.id});
}]);
