'use strict';

/**
* @ngdoc overview
* @name kirosWebApp
* @description
* # kirosWebApp
*
* Main module of the application.
*/

angular
.module('kirosWebApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ngStorage',
    'angularFileUpload',
    'ui.bootstrap'
])
.config(function ($routeProvider, $httpProvider, $locationProvider) {
    $routeProvider
    .when('/', {
        templateUrl: 'views/wiki.html',
        controller: 'WikiCtrl'
    })
    .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'AccountCtrl'
    })
    .when('/logout', {
        templateUrl: 'views/login.html',
        controller: 'AccountCtrl'
    })
    .when('/settings', {
        templateUrl: 'views/settings.html',
        controller: 'AccountSettingsCtrl'
    })
    .when('/wiki/articles', {
        templateUrl: 'views/article-edit.html',
        controller: 'ArticleEditCtrl'
    })
    .when('/wiki/articles/:articleId', {
        templateUrl: 'views/article-edit.html',
        controller: 'ArticleEditCtrl'
    })
    .when('/wiki/articles/:articleId/:slug', {
        templateUrl: 'views/article.html',
        controller: 'ArticleCtrl'
    })
    .when('/contact', {
        templateUrl: 'views/contact.html',
        controller: 'ContactCtrl'
    })
    .when('/reports', {
        templateUrl: 'views/reports.html',
        controller: 'ReportCtrl'
    })
    .when('/reports/edit', {
        templateUrl: 'views/report-edit.html',
        controller: 'ReportEditCtrl'
    })
    .otherwise({
        redirectTo: function() {
            return '/';
        }
    });

    $locationProvider.html5Mode(false);
    $httpProvider.interceptors.push('authInterceptor');
})
.factory('authInterceptor', function($q, $rootScope, $location, $localStorage) {
        return {
            request: function(conf) {
                if (!conf.headers.Authorization &&
                    $localStorage.accessToken) {
                    conf.headers.Authorization = 'Bearer ' + $localStorage.accessToken;
                }

                return conf;
            },
            response : function(response) {
                return response || $q.when(response);
            },
            responseError: function(rejection) {
                if (rejection.status === 401) {
                    delete $localStorage.accessToken;

                    if ($location.path() !== '/login') {
                        $location.path('/login');
                    }
                }

                return $q.reject(rejection);
            }
        };
});
