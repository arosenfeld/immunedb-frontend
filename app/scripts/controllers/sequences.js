(function() {
    'use strict';

    angular.module('ImmunologyApp').controller('SequencesCtrl', ['$scope',
            '$http', '$q', '$location', '$log', 'APIService',
        function($scope, $http, $q, $location, $log, APIService) {

            $scope.prevPage = function() {
                $scope.page = Math.max(1, $scope.page - 1);
                $scope.pageable = false;
                getSequences($scope.page).then(function(result) {
                    $scope.sequences = result;
                    $scope.pageable = true;
                });
            }

            $scope.nextPage = function() {
                $scope.pageable = false;
                getSequences(++$scope.page).then(function(result) {
                    $scope.sequences = result;
                    $scope.pageable = true;
                });
            }

            $scope.updateSequences = function() {
                $scope.showLoader();
                $scope.$parent.page_title = 'Clones';

                $scope.page = 1;
                getSequences().then(function(result) {
                    $scope.sequences = result;
                    $scope.pageable = true;
                    $scope.hideLoader();
                },
                function(result) {
                    $scope.showError();
                });
            }

            var getSequences = function() {
                var def = $q.defer();
                $http({
                    method: 'GET',
                    url: APIService.getUrl() + 'sequences/',
                    params: {
                        'page': $scope.page,
                        'per_page': 25,
                        'filter': typeof($scope.filter) == 'undefined' ? ''
                            : angular.toJson($scope.filter),
                        'order_field': $scope.orderField,
                    }
                }).success(function(data, status) {
                    def.resolve(data['sequences']);
                }).error(function(data, status, headers, config) {
                    def.reject();
                });

                return def.promise;
            }

            $scope.updateOrder = function(field) {
                $scope.orderField = field;
                $scope.updateSequences();
            }

            var init = function() {
                $scope.updateSequences();
            }

            init();
        }
    ]);
})();