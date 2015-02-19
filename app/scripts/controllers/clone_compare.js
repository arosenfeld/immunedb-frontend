(function() {
    'use strict';

    angular.module('ImmunologyApp').controller('ClonesCompareCtrl', ['$scope',
            '$http', '$location', '$routeParams', '$timeout', '$log', '$modal',
            'dnaCompare', 'lineage', 'APIService',
        function($scope, $http, $location, $routeParams, $timeout, $log, $modal,
                dnaCompare, lineage, APIService) {

            $scope.SEQS_PER_CANVAS = 100;

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

            $scope.prevPage = function(cloneId) {
                updateScroller(cloneId, Math.max(0, --$scope.pages[cloneId]));
            }

            $scope.nextPage = function(cloneId) {
                updateScroller(cloneId, ++$scope.pages[cloneId]);
            }

            var updateScroller = function(cloneId, page) {
                var info = $scope.cloneInfo[cloneId];
                dnaCompare.makeComparison(
                    $('#compare-' + cloneId).get(0),
                    info.clone.germline,
                    info.clone.group.cdr3_num_nts,
                    info.seqs.slice(page * $scope.SEQS_PER_CANVAS, (page + 1) * $scope.SEQS_PER_CANVAS),
                    info.seqs.length,
                    info.mutation_stats);
            }

            $scope.addPin = function() {
                var names = [];
                angular.forEach($scope.cloneInfo, function(val, key) {
                    names.push('Clones ' + val['clone']['id']);
                });
                $scope.pins.addPin(names.join(', '));
                $scope.showNotify('This page has been pinned.');
            }

            $scope.updateTree = function(cloneId) {
                lineage.makeTree(APIService.getUrl() +
                    'clone_tree/' + cloneId, '#tree_' + cloneId,
                    $scope.cloneInfo[cloneId].colorBy,
                    !$scope.cloneInfo[cloneId].showFanouts);
            }

            $scope.setThreshold = function(threshold) {
                $scope.threshold = threshold;
                if ($scope.threshold.indexOf('percent') >= 0) {
                    $scope.thresholdName = $scope.threshold.split('_')[1] + '%';
                } else {
                    $scope.thresholdName = $scope.threshold.split('_')[1] +
                        'sequences';
                }
            }

            var init = function() {
                $scope.showLoader();
                $scope.$parent.page_title = 'Clone Comparison';
                $scope.api = APIService.getUrl();
                $scope.pages = {};
                $scope.cutoffs = [
                    ['All', 'percent_0'],
                    ['&ge; 20%', 'percent_20'],
                    ['&ge; 80%', 'percent_80'],
                    ['= 100%', 'percent_100'],
                    ['&ge; 2 Seqs', 'seqs_2'],
                    ['&ge; 5 Seqs', 'seqs_5'],
                    ['&ge; 10 Seqs', 'seqs_10'],
                    ['&ge; 25 Seqs', 'seqs_25'],
                ];
                $scope.setThreshold('percent_0');

                $http({
                    method: 'GET',
                    url: APIService.getUrl() + 'clone_compare/' + $routeParams['uids']
                }).success(function(data, status) {
                    $scope.cloneInfo = data['clones'];
                    angular.forEach($scope.cloneInfo, function(value, key) {
                        value['showFanouts'] = true;
                        value['colorBy'] = 'tissues';
                    });

                    $scope.ceil = Math.ceil;
                    $timeout(function(){
                        for (var cid in $scope.cloneInfo) {
                            updateScroller(cid, 0);
                            $scope.updateTree(cid);
                            $scope.pages[cid] = 0;
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
