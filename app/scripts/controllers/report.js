'use strict';

/**
 * @ngdoc function
 * @name kirosWebApp.controller:AboutCtrl
 * @description
 * Controller of the kirosWebApp
 */

angular.module('kirosWebApp')

.controller('ReportsCtrl', ['$scope', '$location', '$localStorage', 'Reports', 'Comments', 'Accounts', function ($scope, $location, $localStorage, Reports, Comments, Accounts) {
    var me = Accounts.get();

    $scope.showActions = function(a) {
        a.showActions = true;
    };

    $scope.hideActions = function(a) {
        a.showActions = false;
    };

    $scope.total = function(report) {
        return report.activities.reduce(function(x, y) {return x + y.duration;}, 0);
    };

    $scope.reports = Reports.query();

    $scope.addReport = function() {
        console.log('edit report');
        $location.path('/reports/edit');
    };

    $scope.editReport = function (a) {
        console.log('edit report ' + a.id);
        $location.path('/reports/' + a.id + '/edit');
    };
}])

.controller('ReportEditCtrl',['$timeout', '$rootScope', '$scope', '$location', '$routeParams', '$upload', 'Reports', 'Accounts', 'kirosConfig',
        function($timeout, $rootScope,  $scope, $location, $routeParams, $upload, Reports, Accounts, kirosConfig) {
    var me = Accounts.get();
    $scope.opened = false;
    $scope.report = $routeParams.id ? Reports.get({id: $routeParams.id}) : {
        id: '',
        date: new Date().toISOString(),
        activities : [{content: '', duration: 0}],
        blockers : [],
        createdBy: me,
        modifiedBy: me,
        modified: new Date(),
        attachments: []
    };

    $scope.addActivity = function() {
        $scope.report.activities.push({content: '', duration:0});
        $timeout(function() {
            $rootScope.$broadcast('activityAdded');
        }, 0);
    };

    $scope.addBlocker = function() {
        $scope.report.blockers.push({content: ''});
        $timeout(function() {
            $rootScope.$broadcast('blockerAdded');
        }, 0);
    };

    $scope.removeActivity = function(a) {
        var idx = $scope.report.activities.indexOf(a);
        $scope.report.activities.splice(idx, 1);
    };

    $scope.removeBlocker = function(a) {
        var idx = $scope.report.blockers.indexOf(a);
        $scope.report.blockers.splice(idx, 1);
    };


    $scope.toggleOpened = function($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope.opened = true;
    };

    $scope.upload = function (files) {
        files.forEach(function(file) {
            var pObj = {percent: 1, filename: file.name, pending: true};

            var progressHandler = function (evt) {
                pObj.percent = parseInt(100.0 * evt.loaded / evt.total);
            };

            var successHandler = function (data, _status, _headers, config) {
                angular.extend(pObj, {
                    id: data.fileNames[0],
                    modified: new Date().toISOString()
                });
            };

            $scope.report.attachments.push(pObj);
            $upload.upload({
                url: kirosConfig.prime + '/assets',
                file: file
            })
            .progress(progressHandler)
            .success(successHandler);
        });
    };

    $scope.removeAttachment = function(att) {
        for(var i = $scope.report.attachments.length; i--;) {
            if ($scope.report.attachments[i] === att) {
                $scope.report.attachments.splice(i, 1);
                break;
            }
        }
    };

    $scope.saveReport = function() {
        $scope.report.modified = new Date().toISOString();
        $scope.report.modifiedBy = me;
        $scope.report.comments = $scope.report.comments || [];

        $scope.report.activities = $scope.report.activities.filter(function(e) {
            return e.content ? e.content.trim() : e.content;
        });
        $scope.report.blockers = $scope.report.blockers.filter(function(e) {
            return e.content ? e.content.trim() : e.content;
        });

        Reports.save($scope.report).$promise.then(function() {
            $timeout(function() {
                $location.path('/reports');
            }, 1000);
        });
    };

    $scope.cancel = function() {
        $location.path('/reports');
    };

    $scope.open = function($event, report) {
        $event.preventDefault();
        $event.stopPropagation();

        report.opened = true;
    };

    $scope.dateOptions = {
        formatYear: 'yy',
        startingDay: 1
    };

    $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    $scope.format = $scope.formats[0];
}])

.controller('ReportCtrl',['$scope', '$location', '$routeParams', 'Reports', 'Accounts', 'Comments', function($scope, $location, $routeParams, Reports, Accounts, Comments) {
    $scope.total = 0;
    $scope.report = Reports.get({id: $routeParams.id});
    $scope.report.$promise.then(function(res) {
        $scope.total = res.activities ? res.activities.reduce(function(x, y) { return x + y.duration; }, 0) : 0;
    });

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
