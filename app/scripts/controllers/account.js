'use strict';

angular.module('kirosWebApp')

.controller('AccountCtrl', ['$scope', '$location', '$localStorage', '$http', function($scope, $location, $localStorage, $http) {

    if ($location.path() === '/logout') {
        delete $localStorage.accessToken;
        $location.path('/login');
    }

    $scope.account = '';
    $scope.password = '';
    $scope.error = '';

    $scope.login = function () {
        $http.post('https://localhost:20000/token', {
            grant_type : 'password',
            scope: 'wiki auth',
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
                $location.path('/');
            }
        })
        .error(function(data, status) {
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
        $http.post('https://localhost:20000/me',
{oldPassword: $scope.oldpass, newPassword: $scope.newpass}
        , {
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
            $scope.oldpass = '';
            $scope.newpass = '';
            $scope.confirm = '';
            $scope.messages.pop();
            $scope.messages.push({type: 'success', msg: 'Success'});
        })
        .error(function(data, status) {
        });
    };
}]);
