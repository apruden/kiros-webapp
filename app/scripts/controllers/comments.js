'use strict';

angular.module('kirosWebApp')

.controller('CommentsCtrl', ['$scope', '$location', '$localStorage', 'Accounts', 'Comments', function ($scope, $location, $localStorage, Accounts, Comments) {
    $scope.newComment = {
        id: '',
        targetId: $scope.targetId,
        targetType: $scope.targetType,
        content: '',
        attachments:[],
        modifiedBy: {},
        modified: new Date().toISOString()
    };

    $scope.addComment = function() {
        Accounts.get().$promise.then(function(me) {
            $scope.newComment.targetId = $scope.targetId;
            $scope.newComment.modifiedBy = me;
            Comments.save($scope.newComment, function(){
                $scope.comments.unshift($scope.newComment);
                $scope.newComment = {
                    id: '',
                targetId: $scope.targetId,
                targetType: $scope.targetType,
                content: '',
                attachments:[],
                modifiedBy: {},
                modified: new Date().toISOString()};
            });
        });
    };
}]);
