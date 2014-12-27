'use strict';

/**
 * @ngdoc function
 * @name kirosWebApp.controller:AboutCtrl
 * @description
 * # WikiCtrl
 * Controller of the kirosWebApp
 */

angular.module('kirosWebApp')
  .controller('WikiCtrl', ['$scope', 'wikiArticlesResource', function ($scope, wikiArticlesResource) {
    $scope.articles = [{title: 'atest',
        content:'#testing',
        comments:[{content: 'this is a __test__ here', user: {userId: '123', username: 'test@test.com'} }]}]; //wikiArticlesResource.find();

    $scope.editArticle = function () {
        console.log('edit article');
    };
  }])
  .controller('ArticleEditCtrl',['$scope', '$routeParams', 'wikiArticlesResource', function($scope, $routeParams, wikiArticlesResource) {
    $scope.article = {title:'test', content:'toto __test__'};
  }])
  .controller('ArticleCtrl',['$scope', '$routeParams', 'wikiArticlesResource', function($scope,$routeParams, wikiArticlesResource) {
    $scope.article = {
        title: 'test',
        content: 'thi is #test __here__',
        comments:[{}]
    };
  }]);
