'use strict';

angular.module('kirosWebApp')

.service('SearchResult', function() {
    var self = this;
    self.current = {};
    self.setCurrent = function(c) {
        self.current = c;
    };
})

.factory('Presence', ['$resource', 'kirosConfig', function($resource, kirosConfig){
    return $resource(
        kirosConfig.services.prime + '/beats/_aggs');
}])

.factory('Search', ['$resource', 'kirosConfig', function($resource, kirosConfig){
    return $resource(
        kirosConfig.services.prime + '/_search');
}])

.factory('Aggregations', ['$resource', 'kirosConfig', function($resource, kirosConfig){
    return $resource(
        kirosConfig.services.prime + '/_aggs');
}])

.factory('Articles', ['$resource', 'kirosConfig', function($resource, kirosConfig){
    return $resource(
        kirosConfig.services.prime + '/articles/:id',
        {id: '@articleId',
         limit: '@limit' || 20,
         offset: '@offset' || 0 });
}])

.factory('Reports', ['$resource', 'kirosConfig', function($resource, kirosConfig) {
    return $resource(
        kirosConfig.services.prime + '/reports/:id',
        {id: '@reportId',
            limit: '@limit' || 20,
           offset: '@offset' || 0 });
}])

.factory('Files', ['$resource', 'kirosConfig', function($resource, kirosConfig) {
    return $resource(
        kirosConfig.services.files + '/files/:id');
}])

.factory('Comments', ['$resource', 'kirosConfig', function($resource, kirosConfig) {
    return $resource(
         kirosConfig.services.prime + '/comments', {});
}])

.factory('Accounts', ['$resource', 'kirosConfig', function($resource, kirosConfig) {
    return $resource(kirosConfig.services.auth + '/me',{}, {
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
