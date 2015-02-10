'use strict';

angular.module('kirosWebApp')
.factory('Articles', ['$resource', function($resource){
    return $resource(
        'https://localhost:20001/articles/:articleId',
        {articleId: '@articleId',
            limit: '@limit' || 20,
           offset: '@offset' || 0 });
}])
.factory('Comments', ['$resource', function($resource){
    return $resource(
        'https://localhost:20001/articles/:articleId/comments',
        {articleId: '@targetId',
            limit: '@limit' || 20,
           offset: '@offset' || 0 }, {
               query: {
                   method: 'GET',
                   interceptor: function(r, e) {
                       console.log(r);
                       console.log(e);
                   }
               }
           });
}])
.factory('Accounts', ['$resource', function($resource) {
    return $resource('https://localhost:20000/me',{}, {get: {
            method: 'GET',
            interceptor: function(r, e) {
                console.log(r);
                console.log(e);
            }
        }});
}]);
