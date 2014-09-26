'use strict';

angular.module('ImmunologyApp')
    .controller('StudiesCtrl', ['$scope', '$http', '$location', 'apiUrl',
        function($scope,
            $http, $location, apiUrl) {

            $scope.checked_samples = [];

            $scope.viewSamples = function() {
                $location.path('/samples/' + $scope.checked_samples.join());
            };

            var init = function() {
                $scope.$parent.modal_head = 'Querying';
                $scope.$parent.modal_text =
                    'Loading data from database...';
                $('#modal').modal('show');
                $http({
                    method: 'GET',
                    url: apiUrl + 'studies'
                }).success(function(data, status) {
                    $scope.rows = data['objects'];

                    angular.forEach($scope.rows, function(row, i) {
                        row.samples.sort(function(a, b) {
                            var srt = function(e) {
                                return parseInt(e, 10);
                            }
                            var as = a.date.split('-').map(
                                srt);
                            var bs = b.date.split('-').map(
                                srt);
                            return new Date(bs[0], bs[1],
                                    bs[2]) -
                                new Date(as[0], as[1], as[2]);
                        });
                    });

                    $('#modal').modal('hide');
                }).error(function(data, status) {
                    $scope.$parent.modal_head = 'Error';
                    $scope.$parent.modal_text =
                        'There has been an error communicating' +
                        'with the database. If this occurs again, please contact ' +
                        '<a href="mailto:ar374@drexel.edui?subject=SimLab DB' +
                        ' Error">ar374@drexel.edu</a>.';
                });
            };

            init();
        }
    ]);
