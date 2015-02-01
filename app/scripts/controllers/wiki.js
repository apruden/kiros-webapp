'use strict';

/**
 * @ngdoc function
 * @name kirosWebApp.controller:AboutCtrl
 * @description
 * # WikiCtrl
 * Controller of the kirosWebApp
 */

angular.module('kirosWebApp')
  .controller('WikiCtrl', ['$scope', 'Articles', function ($scope, Articles) {
    /*$scope.articles = [{title: 'atest',
        content:'#testing',
        comments:[{content: 'this is a __test__ here', user: {userId: '123', username: 'test@test.com'} }]}]; //wikiArticlesResource.find();*/

    $scope.articles = Articles.query();

    $scope.editArticle = function () {
        console.log('edit article');
    };
  }])
  .controller('ArticleEditCtrl',['$scope', '$routeParams', 'Articles', function($scope, $routeParams, Articles) {
    $scope.article = {title:'test', content:'toto __test__'};
  }])
  .controller('ArticleCtrl',['$scope', '$routeParams', 'Articles', function($scope,$routeParams, Articles) {
    $scope.article = {
        title: 'test',
        content: 'thi is #test __here__',
        comments:[{}]
    };
  }]);
