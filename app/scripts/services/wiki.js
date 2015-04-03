'use strict';

angular.module('kirosWebApp')
.service('SearchResult', function() {
    var self = this;
    self.current = {};
    self.setCurrent = function(c) {
        self.current = c;
    };
})
.factory('Search', ['$resource', 'kirosConfig', function($resource, kirosConfig){
    return $resource(
        kirosConfig.prime + '/search');
}])
.factory('Articles', ['$resource', 'kirosConfig', function($resource, kirosConfig){
    return $resource(
        kirosConfig.prime + '/articles/:id',
        {id: '@articleId',
         limit: '@limit' || 20,
         offset: '@offset' || 0 });
}])

.factory('Reports', ['$resource', 'kirosConfig', function($resource, kirosConfig) {
    return $resource(
        kirosConfig.prime + '/reports/:id',
        {id: '@reportId',
            limit: '@limit' || 20,
           offset: '@offset' || 0 });
}])

.factory('Comments', ['$resource', 'kirosConfig', function($resource, kirosConfig) {
    return $resource(
         kirosConfig.prime + '/comments', {});
}])

.factory('Accounts', ['$resource', 'kirosConfig', function($resource, kirosConfig) {
    return $resource(kirosConfig.auth + '/me',{}, {
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
