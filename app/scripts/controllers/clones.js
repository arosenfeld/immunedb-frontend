(function() {
    'use strict';

    angular.module('ImmunologyApp').controller('ClonesCtrl', ['$scope',
            '$http', '$q', '$routeParams', '$location', '$log', 'APIService',
        function($scope, $http, $q, $routeParams, $location, $log, APIService) {

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

            $scope.viewSamples = function() {
                $location.path($scope.apiPath + '/clone/' + $scope.clone_id + '/' + $scope.clone_samples.join(','));
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
                if (!(typeof $routeParams['group'] == 'undefined')) {
                    if (typeof($scope.filter) == 'undefined') {
                        $scope.filter = {};
                    }
                    $scope.filter.group_id =
                        parseInt($routeParams['group']);
                }
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

            $scope.toggleSample = function(clone_id, sample_id) {
                var existing = $scope.clone_samples.indexOf(sample_id);
                $scope.clone_id = clone_id;
                if (existing < 0) {
                    $scope.clone_samples.push(sample_id);
                } else {
                    $scope.clone_samples.splice(existing, 1);
                }
            }

            $scope.isToggled = function(clone_id, sample_id) {
                return $scope.clone_id == clone_id
                    && $scope.clone_samples.indexOf(sample_id) >= 0;
            }

            $scope.updateOrder = function(field) {
                $scope.orderField = field;
                $scope.updateClones();
            }

            var init = function() {
                $scope.clone_id = null;
                $scope.clone_samples = [];
                $scope.updateClones();
            }

            init();
        }
    ]);
})();
