'use strict';

angular.module('kirosWebApp')
.factory('Articles', ['$resource', function($resource){
    return $resource(
        'https://localhost:20001/articles/:articleId',
        {articleId: '@articleId', limit: '@limit' || 20, offset: '@offset' || 0});
}]);
