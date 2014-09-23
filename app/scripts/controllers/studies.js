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
                $('#loading').modal('show');
                $http({
                    method: 'GET',
                    url: apiUrl + 'studies'
                }).success(function(data, status) {
                    $scope.rows = data['objects'];
                    $('#loading').modal('hide');
                }).error(function(data, status) {
                    $('#loading').modal('hide');
                    $('#error').modal('show');
                });
            };

            init();
        }
    ]);
