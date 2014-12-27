'use strict';

angular.module('kirosWebApp')
    .factory('wikiArticlesResource', ['$resource', function($resource){
        return {
            find: function(articleId, limit, offset){
                return $resource('articles', {articleId: articleId, limit: limit || 20, offset: offset || 0});
                }
        };
    }])
    .factory('wikiCommentsResource', ['$resource', function($resource){
        return {
            find: function(articleId, limit, offset){
                return $resource('comments', {articleId: articleId, limit: limit || 20, offset: offset || 0});
                }
        };
    }]);
