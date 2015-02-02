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
    'ngStorage'
])
.config(function ($routeProvider, $httpProvider, $locationProvider) {
    $routeProvider
    .when('/', {
        templateUrl: 'views/wiki.html',
        controller: 'WikiCtrl'
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
    .otherwise({
        redirectTo: function(a, b, c) {
            console.log('got >>>' + a + '>>' + b + '>>' + c);
            return '/';
        }
    });

    $locationProvider.html5Mode(true);
    $httpProvider.interceptors.push('authInterceptor');
})
.factory('authInterceptor', function($q, $localStorage) {
        return {
            'request': function(conf) {
                if (!conf.headers.Authorization &&
                    $localStorage.accessToken) {
                    conf.headers.Authorization = 'Bearer ' + $localStorage.accessToken;
                }

                return conf;
            },
            'response': function(response) {
                // do something on success
                return response || $q.when(response);
            },

            'responseError': function(rejection) {
                console.log(rejection);
                delete $localStorage.accessToken;
                window.location = 'https://localhost:20000/authorize?client_id=123&scope=wiki&state=&redirect_uri=http%3A%2F%2Flocalhost%3A9000%2F&response_type=token';

                //$httpProvider.defaults.headers.common.Authorization = 'Bearer MTIzOnRvdG9AdGVzdC5jb206d2lraXxobWFj';
                // do something on error
                /*if (canRecover(rejection)) {
                    return responseOrNewPromise;
                }

                return $q.reject(rejection);*/
            }
        };
});
