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
                   isArray: true
               }
           });
}])
.factory('Accounts', ['$resource', function($resource) {
    return $resource('https://localhost:20000/me',{}, {
        get: {
                method: 'GET'
            },
        changePassword: {
           method: 'POST',
           transformRequest: function(data, hg) { //TODO: needs to modify the Content-Type header
               var res = [];
               for (var k in data) {
                   res.push(window.encodeURIComponent(k) + '=' +
                        window.encodeURIComponent(data[k]));
               }

               return '&'.concat(res);
           }
        }
        });
}]);
