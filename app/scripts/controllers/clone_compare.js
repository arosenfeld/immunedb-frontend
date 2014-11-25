(function() {
    'use strict';

    angular.module('ImmunologyApp').controller('ClonesCompareCtrl', ['$scope',
            '$http', '$routeParams', '$timeout', '$log', '$modal', 'dnaCompare',
            'APIService',
        function($scope, $http, $routeParams, $timeout, $log, $modal,
                dnaCompare, APIService) {

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
                $scope.showLoader();
                $scope.$parent.page_title = 'Clone Comparison';
                $scope.api = APIService.getUrl();
                $scope.params = $routeParams['uids'];

                $http({
                    method: 'GET',
                    url: APIService.getUrl() + 'clone_compare/' + $routeParams['uids']
                }).success(function(data, status) {
                    $scope.cloneInfo = data['clones'];
                    $timeout(function() {
                        for (var cloneId in $scope.cloneInfo) {
                            var info = $scope.cloneInfo[cloneId];
                
                            dnaCompare.makeComparison(
                                $('#compare-' + cloneId).get(0),
                                info.clone.germline,
                                info.clone.group.cdr3_num_nts,
                                info.seqs,
                                info.mutation_stats);
                        }
                    }, 0);
                    $scope.hideLoader();
                }).error(function(data, status, headers, config) {
                    $scope.showError()
                });
            }

            init();
        }
    ]);
})();
