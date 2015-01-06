(function() {
    'use strict';

    angular.module('ImmunologyApp') .controller('StudiesCtrl', ['$scope',
            '$log', '$http', '$location', 'APIService',
        function($scope, $log, $http, $location, APIService) {

            $scope.checked_samples = [];

            $scope.viewSamples = function() {
                $location.path($scope.apiPath + '/samples/' + $scope.checked_samples.join());
            }

            $scope.exportMasterTable = function() {
                $location.path($scope.api_path + '/master_table/sample/' + $scope.checked_samples.join());
            }

            $scope.checkAll = function(study_id) {
                angular.forEach($scope.rows[study_id].samples, function(value, key) {
                    $scope.checked_samples.push(value.id);
                });
            }

            var init = function() {
                $scope.$parent.page_title = 'Studies';
                $scope.showLoader();

                $(function() {
                    $('[data-toggle="tooltip"]').tooltip({
                        'placement': 'top'
                    });
                });

                $http({
                    method: 'GET',
                    url: APIService.getUrl() + 'studies'
                }).success(function(data, status) {
                    $scope.rows = data['studies'];

                    angular.forEach($scope.rows, function(row, i) {
                        row.samples.sort(function(a, b) {
                            var srt = function(e) {
                                return parseInt(e, 10);
                            }
                            var as = a.date.split('-').map(
                                srt);
                            var bs = b.date.split('-').map(
                                srt);
                            var ddif = new Date(bs[0], bs[1], bs[2]) - 
                                new Date(as[0], as[1], as[2]);
                            if (ddif != 0) {
                                return ddif;
                            }
                            return a.name.localeCompare(b.name);
                        });
                    });
                    $scope.hideLoader();
                }).error(function(data, status) {
                    $scope.showError();
                });
            };

            init();
        }
    ]);
})();
