(function() {
    'use strict';
    angular.module('ImmunologyApp').controller('ModificationLogCtrl', ['$scope',
            '$http', 'APIService', '$log',
        function($scope, $http, APIService, $log) {
            var init = function() {
                $scope.showLoader();
                $scope.$parent.page_title = 'Modification Log';
                $http({
                    method: 'GET',
                    url: APIService.getUrl() + 'modification_log'
                }).success(function(data, status) {
                    $scope.modifications = data['logs'];
                    $scope.hideLoader();
                }).error(function(data, status, headers, config) {
                    $scope.showError();
                });
            }

            init();
        }
    ]);
})();
