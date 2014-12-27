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
  .config(function ($routeProvider) {
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
  });
