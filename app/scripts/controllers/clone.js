(function() {
    'use strict';

    angular.module('ImmunologyApp').controller('CloneCtrl', ['$scope',
            '$http', '$location', '$routeParams', '$timeout', '$log', '$modal',
            'dnaCompare', 'lineage', 'plotting', 'APIService',
        function($scope, $http, $location, $routeParams, $timeout, $log, $modal,
                dnaCompare, lineage, plotting, APIService) {

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

            $scope.prevPage = function() {
                updateScroller(Math.max(0, --$scope.page));
            }

            $scope.nextPage = function() {
                updateScroller(++$scope.page);
            }

            var updateScroller = function(page) {
                var info = $scope.cloneInfo;
                dnaCompare.makeComparison(
                    $('#compare').get(0),
                    info.clone.germline,
                    info.clone.group.cdr3_num_nts,
                    info.seqs.slice(page * $scope.SEQS_PER_CANVAS, (page + 1) * $scope.SEQS_PER_CANVAS),
                    info.seqs.length,
                    info.mutation_stats);
            }

            $scope.addPin = function() {
                $scope.pins.addPin('Clone ' + $scope.cloneId);
                $scope.showNotify('This page has been pinned.');
            }

            $scope.updateTree = function() {
                $scope.treeError = false;
                $http({
                    method: 'GET',
                    url: APIService.getUrl() + 'clone_tree/' + $routeParams['cloneId']
                }).success(function(data, status) {
                    if (data.length == 0) {
                        $scope.treeError = true;
                    } else {
                        $scope.treeInfo = data.info;
                        lineage.makeTree(data.tree, '#tree', $scope.colorBy,
                                         !$scope.showFanouts);
                    }
                });
            }

            $scope.setThreshold = function(threshold) {
                $scope.threshold = threshold;
                if ($scope.threshold.indexOf('percent') >= 0) {
                    $scope.thresholdName = $scope.threshold.split('_')[1] + '%';
                } else {
                    $scope.thresholdName = $scope.threshold.split('_')[1] +
                        ' Sequences';
                }
            }

            $scope.getColor = function(prob) {
                var color = '';
                prob = parseFloat(prob);
                if (isNaN(prob)) {
                    color = '#ffffff';
                } else if (prob < 0) {
                    var others = parseInt(0xff - 0xff * -prob).toString(16);
                    color = '#' + others + 'ff' + others;
                } else {
                    var others = parseInt(0xff - 0xff * prob).toString(16);
                    color = '#ff' + others + others;
                }

                return { 'background-color': color };
            }

            var init = function() {
                $scope.showLoader();
                $scope.$parent.page_title = 'Clone Comparison';
                $scope.api = APIService.getUrl();
                $scope.page = 0;
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
                if (typeof $routeParams['sampleIds'] != 'undefined') {
                    $scope.sampleWarning = true;
                }

                $http({
                    method: 'GET',
                    url: APIService.getUrl() + 'clone/' + $routeParams['cloneId']
                }).success(function(data, status) {
                    $scope.cloneInfo = data['clone'];
                    $scope.selectionPressure = data.selection_pressure;
                    $scope.apiUrl = APIService.getUrl();
                    $scope.Math = Math;

                    $scope.cloneId = $routeParams['cloneId'];
                    $scope.page = 0;

                    $scope.field = 'unique';
                    $scope.pressureType = 'all';
                    $scope.showFanouts = true;
                    $scope.colorBy = 'tissues';
                    $scope.updateTree();

                    if (data.clone.quality.length > 0) {
                        $scope.hideQuality = false;
                        $('#quality-plot').highcharts(
                            plotting.createPlot(
                                'Phred Quality Score',
                                'quality',
                                'Position',
                                'Avg. Phred Quality Score',
                                'line',
                                [{
                                    name: 'Quality',
                                    data: data.clone.quality,
                                }]));
                        $('#quality-plot').highcharts().reflow();
                    } else {
                        $scope.hideQuality = true;
                    }

                    $timeout(function(){
                        updateScroller(0);
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
