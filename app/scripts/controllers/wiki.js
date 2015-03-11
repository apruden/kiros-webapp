'use strict';

/**
 * @ngdoc function
 * @name kirosWebApp.controller:AboutCtrl
 * @description
 * # WikiCtrl
 * Controller of the kirosWebApp
 */

angular.module('kirosWebApp')


.controller('WikiCtrl', ['$scope', '$location', '$localStorage', 'Articles', 'Comments', 'Accounts', function ($scope, $location, $localStorage, Articles, Comments, Accounts) {
    var me = Accounts.get();

    $scope.newComments = {};
    $scope.comments = {};
    $scope.newCommentsCollapsed = {};

    $scope.articles = Articles.query(function(res) {
        res.forEach(function(a){
            $scope.newCommentsCollapsed[a.articleId] = true;
            $scope.newComments[a.articleId] = {
                commentId: '',
                targetId: a.articleId,
                content: '',
                attachments:[],
                postedBy: me,
                posted: new Date().toISOString()};
            $scope.comments[a.articleId] = [];
        });
    });

    $scope.toggleComment = function(a) {
       $scope.newCommentsCollapsed[a.articleId] = !$scope.newCommentsCollapsed[a.articleId];
    };

    $scope.addComment = function(a) {
        Comments.save($scope.newComments[a.articleId], function(){
            $scope.toggleComment(a);
            $scope.newComments[a.articleId] = $scope.newComments[a.articleId] || []
            $scope.newComments[a.articleId].push({
                    commentId: '',
                    targetId: a.articleId,
                    content: '',
                    attachments:[],
                    postedBy: me,
                    posted: new Date().toISOString()});
        });
    };

    $scope.addArticle = function() {
        $location.path('/wiki/articles');
    };

    $scope.editArticle = function (a) {
        console.log('edit article');
        $location.path('/wiki/articles/' + a.articleId);
    };

    $scope.loadComments = function(a) {
        Comments.query({articleId: a.articleId}, function(comments) {
            comments.forEach(function(c) {
                $scope.comments[a.articleId].push(c);
            });
        });
    };
}])

.controller('ArticleEditCtrl',['$scope', '$location', '$routeParams', '$upload', 'Articles', 'Accounts',
        function($scope, $location, $routeParams, $upload, Articles, Accounts) {
    var me = Accounts.get();
    $scope.article = $routeParams.id ? Articles.get({id: $routeParams.id}) : {
        articleId: '',
        title : '',
        content: '',
        tags : [],
        createdBy: me,
        lastEditBy: {},
        lastEdit: '',
        attachments: []
    };

    $scope.attachments = [];

    $scope.upload = function (files) {
        var progressHandler = function (evt) {
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
        };

        var successHandler = function (data, _status, _headers, config) {
            console.log('file ' + config.file.name + ' uploaded. Response: ' + data);
            $scope.attachments.push({
                filename: data.fileNames[0],
                title: config.file.name,
                created: new Date().toISOString()
            });
        };

        if (files && files.length) {
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                $upload.upload({
                    url: 'https://localhost:20001/assets',
                    file: file
                })
                .progress(progressHandler)
                .success(successHandler);
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
        $location.path('/');
    };

    $scope.cancel = function() {
        $location.path('/');
    };
}])

.controller('ArticleCtrl',['$scope', '$routeParams', 'Articles', function($scope, $routeParams, Articles) {
    $scope.article = Articles.get({id: $routeParams.id});
}]);
