'use strict';

/**
 * @ngdoc function
 * @name kirosWebApp.controller:AboutCtrl
 * @description
 * # WikiCtrl
 * Controller of the kirosWebApp
 */

angular.module('kirosWebApp')

.controller('AccountCtrl', ['$scope', '$location', '$localStorage', '$http', 'Accounts', function($scope, $location, $localStorage, $http, Accounts) {

    if ($location.path() === '/logout') {
        delete $localStorage.accessToken;
        $location.path('/login');
    }

    $scope.account = '';
    $scope.password = '';
    $scope.error = '';

    $scope.login = function () {
        $http.post('https://localhost:20000/token', {
            grant_type : 'password',
            scope: 'wiki',
            username: $scope.username,
            password: $scope.password
        }, {
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            transformRequest: function(obj) {
                var str = [];
                for(var p in obj) {
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                }

                return str.join("&");
            }
        })
        .success(function(data, status, headers, config) {
            if (data.access_token) {
                console.log('Saving access token');
                $localStorage.accessToken = data.access_token;
                $location.path('/');
            }
        })
        .error(function(data, status, headers, config) {
            $scope.error = {status: status, data: data};
        });
    };

}])

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
       $scope.newCommentsCollapsed[a.articleId] ^= true;
    };

    $scope.addComment = function(a) {
        Comments.save($scope.newComments[a.articleId]);
        $scope.newComments[a.articleId] = {
                commentId: '',
                targetId: a.articleId,
                content: '',
                attachments:[],
                postedBy: me,
                posted: new Date().toISOString()};
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
                $scope.comments[a.articleId].push(c)
            });
        });
    };
}])

.controller('ArticleEditCtrl',['$scope', '$routeParams', '$localStorage', '$upload', 'Articles', 'Accounts',
        function($scope, $routeParams, $localStorage, $upload, Articles, Accounts) {
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
