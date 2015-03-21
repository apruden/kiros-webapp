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
    function addArticles (articles) {
        articles.forEach(function(a){
            $scope.newCommentsCollapsed[a.id] = true;
            $scope.newComments[a.id] = {
                id: '',
                targetId: a.id,
                targetType: 'article',
                content: '',
                attachments:[],
                modifiedBy: {},
                modified: new Date().toISOString()};
        });
    };

    $scope.newComments = {};
    $scope.newCommentsCollapsed = {};
    $scope.articles = Articles.query(function(res) {
        addArticles(res) ;
    });

    $scope.toggleComment = function(a) {
       $scope.newCommentsCollapsed[a.id] = !$scope.newCommentsCollapsed[a.id];
    };

    $scope.addComment = function(a) {
        Accounts.get().$promise.then(function(me) {
            a.modifiedBy = me;
            $scope.newComments[a.id].modifiedBy = me;
            Comments.save($scope.newComments[a.id], function(){
                $scope.toggleComment(a);
                $scope.newComments[a.id] = {
                        id: '',
                        targetId: a.id,
                        targetType: 'article',
                        content: '',
                        attachments:[],
                        modifiedBy: {},
                        modified: new Date().toISOString()};
            });
        });
    };

    $scope.addArticle = function() {
        $location.path('/articles/edit');
    };

    $scope.editArticle = function (a) {
        $location.path('/articles/' + a.id + '/edit');
    };
}])

.controller('ArticleEditCtrl',['$scope', '$location', '$routeParams', '$upload', 'Articles', 'Accounts',
        function($scope, $location, $routeParams, $upload, Articles, Accounts) {
    var me = Accounts.get();
    $scope.article = $routeParams.id ? Articles.get({id: $routeParams.id}) : {
        id: '',
        title : '',
        content: '',
        tags : [],
        comments: [],
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
                id: data.fileNames[0],
                filename: config.file.name,
                modified: new Date().toISOString()
            });
        };

        if (files && files.length) {
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                console.log(file);

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
        $scope.article.modified = new Date().toISOString();
        $scope.article.modifiedBy = me;
        $scope.article.attachments = $scope.attachments;
        Articles.save($scope.article);
        $location.path('/');
    };

    $scope.cancel = function() {
        $location.path('/');
    };
}])

.controller('ArticleCtrl',['$scope', '$routeParams', '$location', 'Articles', function($scope, $routeParams, $location, Articles) {
    $scope.article = Articles.get({id: $routeParams.id});

    $scope.editArticle = function() {
        $location.path('/articles/' + $scope.article.id + '/edit');
    };
}]);
