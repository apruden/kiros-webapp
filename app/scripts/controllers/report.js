'use strict';

/**
 * @ngdoc function
 * @name kirosWebApp.controller:AboutCtrl
 * @description
 * Controller of the kirosWebApp
 */

angular.module('kirosWebApp')

.controller('ReportsCtrl', ['$scope', '$location', '$localStorage', 'Reports', 'Comments', 'Accounts', 'SearchResult',function ($scope, $location, $localStorage, Reports, Comments, Accounts, SearchResult) {
    var me = Accounts.get();

    $scope.newComments = {};
    $scope.comments = {};
    $scope.newCommentsCollapsed = {};

    $scope.reports = angular.equals({}, SearchResult.current) ? Reports.query(function(res) {
        res.forEach(function(a){
            $scope.newCommentsCollapsed[a.id] = true;
            $scope.newComments[a.id] = {
                id: '',
                targetId: a.id,
                targetType: 'report',
                content: '',
                attachments:[],
                modifiedBy: me,
                modified: new Date().toISOString()};
            $scope.comments[a.id] = [];
        });
    }) : SearchResult.current.reports;

    $scope.addComment = function(a) {
        Accounts.get().$promise.then(function(me) {
            a.modifiedBy = me;
            $scope.newComments[a.id].modifiedBy = me;
            Comments.save($scope.newComments[a.id], function(){
                $scope.newComments[a.id] = {
                        id: '',
                        targetId: a.id,
                        targetType: 'report',
                        content: '',
                        attachments:[],
                        modifiedBy: me,
                        modified: new Date().toISOString()};
            });
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

    $scope.$on('searchResult', function(e, r) {
        $scope.reports = r.reports;
    });
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
                id: data.fileNames[0],
                filename: config.file.name,
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
        $scope.report.comments = $scope.report.comments || [];
        console.log(JSON.stringify($scope.report));
        Reports.save($scope.report);
        //$location.path('/');
    };

    $scope.cancel = function() {
        $location.path('/');
    };
}])
.controller('ReportCtrl',['$scope', '$location', '$routeParams', 'Reports', 'Accounts', 'Comments', function($scope, $location, $routeParams, Reports, Accounts, Comments) {
    $scope.report = Reports.get({id: $routeParams.id});

    $scope.editReport = function() {
        $location.path('/reports/' + $scope.report.id +'/edit');
    };

    $scope.addComment = function() {
        var a = $scope.report;
        Accounts.get().$promise.then(function(me) {
            a.modifiedBy = me;
            $scope.newComments[a.id].modifiedBy = me;
            Comments.save($scope.newComments[a.id], function(){
                $scope.newComments[a.id] = {
                    id: '',
                    targetId: a.id,
                    targetType: 'report',
                    content: '',
                    attachments:[],
                    modifiedBy: me,
                    modified: new Date().toISOString()
                };
            });
        });
    };
}]);
