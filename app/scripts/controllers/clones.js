(function() {
    'use strict';

    angular.module('ImmunologyApp').controller('ClonesCtrl', ['$scope',
            '$http', '$q', '$location', '$log', 'APIService',
        function($scope, $http, $q, $location, $log, APIService) {

            $scope.prevPage = function() {
                $scope.page = Math.max(1, $scope.page - 1);
                $scope.pageable = false;
                getClones($scope.page).then(function(result) {
                    $scope.clones = result;
                    $scope.pageable = true;
                });
            }

            $scope.nextPage = function() {
                $scope.pageable = false;
                getClones(++$scope.page).then(function(result) {
                    $scope.clones = result;
                    $scope.pageable = true;
                });
            }

            $scope.checked_samples = [];

            $scope.viewSamples = function() {
                $location.path($scope.api_path + '/clone_compare/' + $scope.checked_samples.join());
            }

            $scope.updateClones = function() {
                $scope.clones = [];
                $scope.showLoader();
                $scope.$parent.page_title = 'Clones';


                $scope.page = 1;
                getClones().then(function(result) {
                    $scope.clones = result;
                    $scope.pageable = true;
                    $scope.hideLoader();
                },
                function(result) {
                    $scope.showError();
                });
            }

            var getClones = function() {
                var def = $q.defer();
                $http({
                    method: 'GET',
                    url: APIService.getUrl() + 'clones/',
                    params: {
                        'page': $scope.page,
                        'per_page': 10,
                        'filter': typeof($scope.filter) == 'undefined' ? ''
                            : angular.toJson($scope.filter),
                        'order_field': $scope.orderField,
                    }
                }).success(function(data, status) {
                    def.resolve(data['clones']);
                }).error(function(data, status, headers, config) {
                    def.reject();
                });

                return def.promise;
            }

            $scope.updateOrder = function(field) {
                $scope.orderField = field;
                $scope.updateClones();
            }

            var init = function() {
                $scope.updateClones();
            }

            init();
        }
    ]);
})();
