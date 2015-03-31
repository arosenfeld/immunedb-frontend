(function() {
    'use strict';
    angular.module('ImmunologyApp').controller('ExportMutationsCtrl', ['$scope',
            '$http', '$routeParams', '$log', 'APIService',
        function($scope, $http, $routeParams, $log, APIService) {

            $scope.types = [
                {
                    'type': 'seqs',
                    'text': 'Sequences'
                },
                {
                    'type': 'percent',
                    'text': 'Percentage'
                }
            ];

            $scope.changeType = function(threshType) {
                $scope.threshType = threshType.type;
                $scope.threshTypeText = threshType.text;
            }

            var init = function() {
                $scope.showLoader();
                $scope.$parent.page_title = 'Mutations Export';
                $scope.apiUrl = APIService.getUrl();

                $scope.type = $routeParams['type'].charAt(0).toUpperCase() +
                    $routeParams['type'].slice(1);
                $scope.id = $routeParams['id'];

                $scope.changeType($scope.types[0]);
                $scope.threshValue = 0;

                $scope.hideLoader()
            }

            init();
        }
    ]);
})();
