'use strict';

mailApp.controller('MainCtrl', function($scope, $http) {
    $http.get('mails/messages.json').success(function(data) {
        $scope.messages = data;
    });
});
