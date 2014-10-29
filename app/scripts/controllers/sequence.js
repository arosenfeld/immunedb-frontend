(function() {
    'use strict';
    angular.module('ImmunologyApp') .controller('SequenceCtrl', ['$scope',
            '$http', '$routeParams', '$log', 'dnaCompare', 'apiUrl',
        function($scope, $http, $routeParams, $log, dnaCompare, apiUrl) {
            var init = function() {
                // Show the loading popup
                $scope.$parent.modal_head = 'Querying';
                $scope.$parent.modal_text =
                    'Loading data from database...';
                $('#modal').modal('show');
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
                    url: apiUrl + 'sequence/' + $routeParams['sampleId'] + '/'
                    + $routeParams['seqId'],
                }).success(function(data, status) {
                    $scope.seq = data['sequence'];
                    dnaCompare.makeComparison(
                        $('#germline-compare').get(0),
                        $scope.seq.clone.germline,
                        $scope.seq.clone.cdr3_num_nts,
                        [ $scope.seq ]);
                    $('#modal').modal('hide');
                }).error(function(data, status, headers, config) {
                    $scope.$parent.modal_head = 'Error';
                    $scope.$parent.modal_text =
                        'There has been an error communicating with the database. If this occurs again, please contact <a href="mailto:ar374@drexel.edui?subject=SimLab DB Error">ar374@drexel.edu</a>.';
                });
            }

            init();
        }
    ]);
})();
