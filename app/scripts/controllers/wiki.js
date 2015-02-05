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

    $scope.newComment = {};
    $scope.articles = Articles.query();

    $scope.addComment = function(a) {
        a.comments.push(a);
    };

    $scope.addArticle = function() {
        $location.path('/wiki/articles');
    };

    $scope.editArticle = function (a) {
        console.log('edit article');
        $location.path('/wiki/articles/' + a.articleId);
    };
}])

.controller('ArticleEditCtrl',['$scope', '$routeParams', '$localStorage', '$upload', 'Articles', 'Accounts',
        function($scope, $routeParams, $localStorage, $upload, Articles, Accounts) {
    var me =Accounts.get();
    $scope.article = $routeParams.id ? Articles.get({id: $routeParams.id}) : {
        articleId: '',
        title : '',
        content: '',
        tags : [],
        createdBy: me,
        lastEditBy: {},
        lastEdit: '',
        attachments: [],
        comments: []
    };

    $scope.attachments = [];

    $scope.upload = function (files) {
        if (files && files.length) {
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                $upload.upload({
                    url: 'https://localhost:20001/assets',
                    file: file
                }).progress(function (evt) {
                    var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                    console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
                }).success(function (data, status, headers, config) {
                    console.log('file ' + config.file.name + ' uploaded. Response: ' + data);
                    $scope.attachments.push({
                        filename: data.fileNames[0],
                        title: config.file.name,
                        created: new Date().toISOString()
                    });
                });
            }
        }
    };

    $scope.removeAttachment = function(att) {
        for(var i = $scope.attachments.length; i--;) {
            if ($scope.attachments[i] === att) {
                $scope.attachments.splice(i, 1);
                break;
            }
        }
    };

    $scope.saveArticle = function() {
        $scope.article.lastEdit = new Date().toISOString();
        $scope.article.lastEditBy = me;
        $scope.article.attachments = $scope.attachments;
        Articles.save($scope.article);
        location = '/';
    };

    $scope.cancel = function() {
        location = '/';
    };
}])

.controller('ArticleCtrl',['$scope', '$routeParams', 'Articles', function($scope, $routeParams, Articles) {
    $scope.article = Articles.get({id: $routeParams.id});
}]);
