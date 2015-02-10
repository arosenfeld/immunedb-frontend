(function() {
    'use strict';
    angular.module('ImmunologyApp').controller('ModificationLogCtrl', ['$scope',
            '$http', '$q', 'APIService', '$log',
        function($scope, $http, $q, APIService, $log) {

            $scope.prevPage = function() {
                $scope.page = Math.max(1, $scope.page - 1);
                $scope.pageable = false;
                getModifications().then(function(result) {
                    $scope.results = result;
                    $scope.pageable = true;
                });
            }

            $scope.nextPage = function() {
                $scope.pageable = false;
                $scope.page++;
                getModifications().then(function(result) {
                    $scope.results = result;
                    $scope.pageable = true;
                });
            }

            var getModifications = function() {
                var def = $q.defer();
                $http({
                    method: 'GET',
                    url: APIService.getUrl() + 'modification_log',
                    params: {
                        'page': $scope.page,
                        'per_page': 10,
                    }
                }).success(function(data, status) {
                    def.resolve(data['logs']);
                }).error(function(data, status, headers, config) {
                    def.reject();
                });

                return def.promise;
            }

            var init = function() {
                $scope.showLoader();
                $scope.$parent.page_title = 'Modification Log';

                $scope.pageable = false;
                $scope.page = 1;
                getModifications().then(function(result) {
                    $scope.results = result;
                    $scope.pageable = true;
                    $scope.hideLoader();
                });
            }

            init();
        }
    ]);
})();
