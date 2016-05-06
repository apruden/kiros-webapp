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
    $scope.articles = Articles.query();

    $scope.loadMore = function() {
        $scope.offset = $scope.articles.length;
        Articles.query({offset: $scope.offset}, function(res) {
            $scope.offset += res.length;
            res.forEach(function(r) {
                $scope.articles.push(r);
            });
        });
    };

    $scope.showActions = function(a) {
        a.showActions = true;
    };

    $scope.hideActions = function(a) {
        a.showActions = false;
    };

    $scope.addArticle = function() {
        $location.path('/articles/edit');
    };

    $scope.editArticle = function (a) {
        $location.path('/articles/' + a.id + '/edit');
    };
}])

.controller('ArticleEditCtrl',['$timeout', '$scope', '$location', '$routeParams', 'Upload', 'Articles', 'Accounts', 'kirosConfig',
        function($timeout, $scope, $location, $routeParams, Upload, Articles, Accounts, kirosConfig) {
    var me = Accounts.get();
    $scope.article = $routeParams.id ? Articles.get({id: $routeParams.id}) : {
        id: '',
        title : '',
        content: '',
        tags : [],
        comments: [],
        attachments: [],
        createdBy: me
    };

    $scope.upload = function (files) {
        files.forEach(function(file) {
            var pObj = {percent: 1, filename: file.name, pending: true};

            var progressHandler = function (evt) {
                pObj.percent = parseInt(100.0 * evt.loaded / evt.total);
            };

            var successHandler = function (data) {
                angular.extend(pObj, {
                    id: data.fileNames[0],
                    modified: new Date().toISOString()
                });
            };

            $scope.article.attachments.push(pObj);
            Upload.upload({
                url: kirosConfig.prime + '/assets',
                file: file
            })
            .progress(progressHandler)
            .success(successHandler);
        });
    };

    $scope.removeAttachment = function(att) {
        for(var i = $scope.article.attachments.length; i--;) {
            if ($scope.article.attachments[i] === att) {
                $scope.article.attachments.splice(i, 1);
                break;
            }
        }
    };

    $scope.saveArticle = function() {
        $scope.article.modified = new Date().toISOString();
        $scope.article.modifiedBy = me;
        Articles.save($scope.article).$promise.then(function() {
            $timeout(function() {
                $location.path('/');
            }, 1000);
        });
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
