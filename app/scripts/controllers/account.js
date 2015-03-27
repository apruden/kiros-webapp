'use strict';

angular.module('kirosWebApp')

.controller('AccountCtrl', ['$scope', '$rootScope', '$location', '$localStorage', '$http', 'Accounts', function($scope, $rootScope, $location, $localStorage, $http, Accounts) {

    if ($location.path() === '/logout') {
        delete $localStorage.accessToken;
        $location.path('/login');
    }

    $rootScope.$broadcast('authenticated', false);
    $scope.account = '';
    $scope.password = '';
    $scope.error = '';

    $scope.login = function () {
        $http.post('https://localhost:20000/token', {
            grant_type : 'password',
            scope: 'prime auth',
            username: $scope.username,
            password: $scope.password
        }, {
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            transformRequest: function(obj) {
                var str = [];

                for(var p in obj) {
                    str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
                }

                return str.join('&');
            }
        })
        .success(function(data) {
            if (data.access_token) {
                console.log('Saving access token');
                $localStorage.accessToken = data.access_token;

                Accounts.get().$promise.then(function(u) {
                    $rootScope.$broadcast('authenticated', u);
                    $localStorage.user = u;
                    $location.path('/');
                });
            }
        })
        .error(function(data, status) {
            $rootScope.$broadcast('authenticated', false);
            $scope.error = {status: status, data: data};
        });
    };
}])

.controller('AccountSettingsCtrl', ['$scope', '$location', '$http', function($scope, $location, $http) {
    $scope.messages = [];
    $scope.oldpass = '';
    $scope.newpass = '';
    $scope.confirm = '';

    $scope.changePass = function() {
        $http.post(
            'https://localhost:20000/me', {
                oldPassword: $scope.oldpass,
                newPassword: $scope.newpass
            }, {
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            transformRequest: function(obj) {
                var str = [];

                for(var p in obj) {
                    str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
                }

                return str.join('&');
            }
        })
        .success(function() {
            $scope.oldpass = '';
            $scope.newpass = '';
            $scope.confirm = '';
            $scope.messages.pop();
            $scope.messages.push({type: 'success', msg: 'Success'});
        })
        .error(function() {
        });
    };
}]);
