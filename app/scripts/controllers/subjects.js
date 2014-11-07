(function() {
    'use strict';

    angular.module('ImmunologyApp') .controller('SubjectsCtrl', ['$scope',
            '$http', '$q', '$location', '$log', 'APIService',
        function($scope, $http, $q, $location, $log, APIService) {

            $scope.prevPage = function() {
                $scope.page = Math.max(1, $scope.page - 1);
                $scope.pageable = false;
                getPage($scope.page).then(function(result) {
                    $scope.objects = result;
                    $scope.pageable = true;
                });
            }

            $scope.nextPage = function() {
                $scope.pageable = false;
                getPage(++$scope.page).then(function(result) {
                    $scope.objects = result;
                    $scope.pageable = true;
                });
            }

            $scope.checked_samples = [];

            $scope.viewSamples = function() {
                $location.path('/samples/' + $scope.checked_samples.join());
            };

            var getPage = function(page) {
                var def = $q.defer();
                $http({
                    method: 'GET',
                    url: APIService.getUrl() + 'subjects',
                    params: {
                        'page': page,
                        'per_page': 25
                    }
                }).success(function(data, status) {
                    def.resolve(data['subjects']);
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
                $scope.$parent.page_title = 'Subjects';

                $scope.page = 1;
                getPage($scope.page).then(
                    function(result) {
                        $scope.objects = result;
                        $scope.pageable = true;
                        $('#modal').modal('hide');
                    },
                    function(result) {
                        $scope.$parent.modal_head = 'Error';
                        $scope.$parent.modal_text =
                            'There has been an error communicating with the database. If this occurs again, please contact <a href="mailto:ar374@drexel.edui?subject=SimLab DB Error">ar374@drexel.edu</a>.';
                    }
                );
            }

            init();
        }
    ]);
})();
