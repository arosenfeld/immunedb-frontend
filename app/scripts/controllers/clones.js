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
                $location.path('/clone_compare/' + $scope.checked_samples.join());
            }

            $scope.updateClones = function() {
                $scope.page = 1;
                getClones().then(function(result) {
                    $scope.clones = result;
                    $scope.pageable = true;
                    $('#modal').modal('hide');
                },
                function(result) {
                    $scope.$parent.modal_head = 'Error';
                    $scope.$parent.modal_text =
                        'There has been an error communicating with the database. If this occurs again, please contact <a href="mailto:ar374@drexel.edui?subject=SimLab DB Error">ar374@drexel.edu</a>.';
                });
            }

            var getClones = function() {
                var def = $q.defer();
                $http({
                    method: 'GET',
                    url: APIService.getUrl() + 'clones/',
                    params: {
                        'page': $scope.page,
                        'per_page': 25,
                        'filter': typeof($scope.filter) == 'undefined' ? ''
                            : angular.toJson($scope.filter),
                    }
                }).success(function(data, status) {
                    def.resolve(data['objects']);
                }).error(function(data, status, headers, config) {
                    def.reject();
                });

                return def.promise;
            }

            var init = function() {
                $scope.$parent.modal_head = 'Querying';
                $scope.$parent.modal_text =
                    'Loading data from database...';
                $('#modal').modal('show');
                $scope.$parent.page_title = 'Clones';

                $scope.updateClones();
            }

            init();
        }
    ]);
})();
