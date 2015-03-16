'use strict';

/**
 * @ngdoc function
 * @name kirosWebApp.controller:AboutCtrl
 * @description
 * Controller of the kirosWebApp
 */

angular.module('kirosWebApp')


.controller('ReportCtrl', ['$scope', '$location', '$localStorage', 'Reports', 'Comments', 'Accounts', function ($scope, $location, $localStorage, Reports, Comments, Accounts) {
    var me = Accounts.get();

    $scope.newComments = {};
    $scope.comments = {};
    $scope.newCommentsCollapsed = {};

    /*$scope.reports = Reports.query(function(res) {
        res.forEach(function(a){
            $scope.newCommentsCollapsed[a.id] = true;
            $scope.newComments[a.id] = {
                id: '',
                targetId: a.id,
                content: '',
                attachments:[],
                postedBy: me,
                posted: new Date().toISOString()};
            $scope.comments[a.id] = [];
        });
    });*/

    $scope.toggleComment = function(a) {
       $scope.newCommentsCollapsed[a.id] = !$scope.newCommentsCollapsed[a.id];
    };

    $scope.addComment = function(a) {
        Comments.save($scope.newComments[a.id], function(){
            $scope.toggleComment(a);
            $scope.newComments[a.id] = {
                    id: '',
                    targetId: a.id,
                    content: '',
                    attachments:[],
                    postedBy: me,
                    posted: new Date().toISOString()};
        });
    };

    $scope.addReport = function() {
        console.log('edit report');
        $location.path('/reports/edit');
    };

    $scope.editReport = function (a) {
        console.log('edit report');
        $location.path('/reports/edit/' + a.id);
    };

    $scope.loadComments = function(a) {
        Comments.query({reportId: a.id}, function(comments) {
            comments.forEach(function(c) {
                $scope.comments[a.id].push(c);
            });
        });
    };
}])

.controller('ReportEditCtrl',['$scope', '$location', '$routeParams', '$upload', 'Reports', 'Accounts',
        function($scope, $location, $routeParams, $upload, Reports, Accounts) {
    var me = Accounts.get();
    $scope.report = $routeParams.id ? Reports.get({id: $routeParams.id}) : {
        id: '',
        date: new Date().toISOString(),
        activities : [{content: '', duration: 0}],
        blockers : [],
        modifiedBy: me,
        modified: new Date(),
        attachments: []
    };

    $scope.addActivity = function() {
        $scope.report.activities.push({content: '', duration:0});
    };

    $scope.addBlocker = function() {
        $scope.report.blockers.push({content: ''});
    };

    $scope.removeActivity = function(a) {
        var idx = $scope.report.activities.indexOf(a);
        $scope.report.activities.splice(idx, 1);
    };

    $scope.removeBlocker = function(a) {
        var idx = $scope.report.blockers.indexOf(a);
        $scope.report.blockers.splice(idx, 1);
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
                modified: new Date().toISOString()
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

    $scope.saveReport = function() {
        $scope.report.modified = new Date().toISOString();
        $scope.report.modifiedBy = me;
        $scope.report.attachments = $scope.attachments;
        console.log(JSON.stringify($scope.report));
        Reports.save($scope.report);
        //$location.path('/');
    };

    $scope.cancel = function() {
        $location.path('/');
    };
}]);
