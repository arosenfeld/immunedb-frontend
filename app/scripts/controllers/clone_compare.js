(function() {
    'use strict';

    angular.module('ImmunologyApp').controller('ClonesCompareCtrl', ['$scope',
            '$http', '$routeParams', '$timeout', '$log', '$modal', 'dnaCompare',
            'apiUrl',
        function($scope, $http, $routeParams, $timeout, $log, $modal,
                dnaCompare, apiUrl) {

            $scope.openModal = function(title, mutations) {
                $modal.open({
                    templateUrl: 'mutationsModal.html',
                    controller: 'AlertModalCtrl',
                    resolve: {
                        title: function() {
                            return title;
                        },
                        data: function() {
                            return mutations;
                        }
                    }
                });
            }

            var init = function() {
                $scope.$parent.modal_head = 'Querying';
                $scope.$parent.modal_text =
                    'Loading data from database...';
                $('#modal').modal('show');
                $scope.$parent.page_title = 'Clone Comparison';

                $http({
                    method: 'GET',
                    url: apiUrl + 'clone_compare/' + $routeParams['uids']
                }).success(function(data, status) {
                    $scope.cloneInfo = data['clones'];
                    $timeout(function() {
                        for (var cloneId in $scope.cloneInfo) {
                            var info = $scope.cloneInfo[cloneId];
                
                            dnaCompare.makeComparison(
                                $('#compare-' + cloneId).get(0),
                                info.clone.germline,
                                info.clone.cdr3_num_nts,
                                info.seqs,
                                info.mutation_stats);
                        }
                    }, 0);
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
