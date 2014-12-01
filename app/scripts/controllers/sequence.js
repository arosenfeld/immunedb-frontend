(function() {
    'use strict';
    angular.module('ImmunologyApp') .controller('SequenceCtrl', ['$scope',
            '$http', '$routeParams', '$log', 'dnaCompare', 'APIService',
        function($scope, $http, $routeParams, $log, dnaCompare, APIService) {
            var init = function() {
                $scope.showLoader()
                $scope.$parent.page_title = 'Sequence Details';

                // Enable help tooltips
                $(function() {
                    $('[data-toggle="tooltip"]').tooltip({
                        'placement': 'top'
                    });
                });

                // Do the GET request for results
                $http({
                    method: 'GET',
                    url: APIService.getUrl() + 'sequence/' + $routeParams['sampleId'] + '/'
                    + $routeParams['seqId'],
                }).success(function(data, status) {
                    $scope.seq = data['sequence'];
                    $scope.seq_id = $routeParams['seqId'];
                    dnaCompare.makeComparison(
                        $('#germline-compare').get(0),
                        $scope.seq.germline,
                        $scope.seq.junction_nt.length,
                        [ $scope.seq ], 1);
                    $scope.hideLoader()
                }).error(function(data, status, headers, config) {
                    $scope.showError();
                });
            }

            init();
        }
    ]);
})();
