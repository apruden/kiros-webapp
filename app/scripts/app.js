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
    'ngTouch'
])
.config(function ($routeProvider, $httpProvider) {
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
        redirectTo: '/'
    });

    $httpProvider.defaults.headers.common.Authorization = 'Bearer MTIzOnRvdG9AdGVzdC5jb206d2lraXxobWFj'

    $httpProvider.interceptors.push(function($q) {
        return {
            'response': function(response) {
                // do something on success
                console.log('>>>ok')
                return response || $q.when(response);
            },

            'responseError': function(rejection) {
                debugger;
                console.log('<<<ERR:' + rejection);
                window.location = 'https://localhost:20000/'
                // do something on error
                /*if (canRecover(rejection)) {
                    return responseOrNewPromise;
                }

                return $q.reject(rejection);*/

            }
        };
    });
});
