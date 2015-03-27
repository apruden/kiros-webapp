'use strict';

angular.module('kirosWebApp')
.service('SearchResult', function() {
    var self = this;
    self.current = {};
    self.setCurrent = function(c) {
        self.current = c;
    };
})
.factory('Search', ['$resource', function($resource){
    return $resource(
        'https://localhost:20001/search');
}])
.factory('Articles', ['$resource', function($resource){
    return $resource(
        'https://localhost:20001/articles/:id',
        {id: '@articleId',
         limit: '@limit' || 20,
         offset: '@offset' || 0 });
}])

.factory('Reports', ['$resource', function($resource){
    return $resource(
        'https://localhost:20001/reports/:id',
        {id: '@reportId',
            limit: '@limit' || 20,
           offset: '@offset' || 0 });
}])

.factory('Comments', ['$resource', function($resource){
    return $resource(
        'https://localhost:20001/comments', {});
}])

.factory('Accounts', ['$resource', function($resource) {
    return $resource('https://localhost:20000/me',{}, {
        get: {
                method: 'GET'
            },
        changePassword: {
           method: 'POST',
           transformRequest: function(data) { //TODO: needs to modify the Content-Type header
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
