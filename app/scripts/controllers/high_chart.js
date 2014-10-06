(function() {
    'use strict';

    angular.module('ImmunologyApp') .controller('HighChartController',
            function($scope) {
        $scope.initConfig = function(config) {
            $scope.config = angular.copy(config);
        }
    });
})();
