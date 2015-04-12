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
    }

    $scope.articles = Articles.query(function(res) {
        addArticles(res);
    });

    $scope.addArticle = function() {
        $location.path('/articles/edit');
    };

    $scope.editArticle = function (a) {
        $location.path('/articles/' + a.id + '/edit');
    };
}])

.controller('ArticleEditCtrl',['$timeout', '$scope', '$location', '$routeParams', '$upload', 'Articles', 'Accounts', 'kirosConfig',
        function($timeout, $scope, $location, $routeParams, $upload, Articles, Accounts, kirosConfig) {
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
    $scope.progresses = [];
    $scope.progressesDict = {};

    $scope.upload = function (files) {
        var progressHandler = function (evt) {
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            $scope.progressesDict[evt.config.file.name].percent = progressPercentage;
        };

        var successHandler = function (data, _status, _headers, config) {
            var pObj, pIdx;
            $scope.attachments.push({
                id: data.fileNames[0],
                filename: config.file.name,
                modified: new Date().toISOString()
            });

            pObj = $scope.progressesDict[config.file.name];
            pIdx = $scope.progresses.indexOf(pObj);
            $scope.progresses.splice(pIdx, 1);
        };

        if (files && files.length) {
            for (var i = 0; i < files.length; i++) {
                var file = files[i],
                    progObj = {name: file.name, percent: 0};
                $scope.progresses.push(progObj);
                $scope.progressesDict[file.name] = progObj;

                $upload.upload({
                    url: kirosConfig.prime + '/assets',
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

.controller('ArticleCtrl',['$scope', '$routeParams', '$location', 'Articles', 'Accounts', 'Comments', function($scope, $routeParams, $location, Articles, Accounts, Comments) {
    $scope.article = Articles.get({id: $routeParams.id});

    $scope.editArticle = function() {
        $location.path('/articles/' + $scope.article.id + '/edit');
    };

}]);
