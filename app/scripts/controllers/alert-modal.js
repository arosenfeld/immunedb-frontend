(function() {
    'use strict';

    angular.module('ImmunologyApp').controller('AlertModalCtrl', function($scope,
            $modalInstance, title, data) {
        $scope.title = title;
        $scope.data = data;

        $scope.dismiss = function() {
            $modalInstance.dismiss();
        }
    });
})();
