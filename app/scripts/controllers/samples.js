(function() {
    'use strict';

    angular.module('ImmunologyApp') .controller('SampleCtrl', ['$scope',
            '$http', '$routeParams', '$log', '$q', 'plotting', '$timeout',
            'APIService',
        function($scope, $http, $routeParams, $log, $q, plotting, $timeout, APIService) {

            var columnPlots = [{
                title: 'CDR3 Length',
                key: 'cdr3_length_dist',
            }, {
                title: 'V Gene Length',
                key: 'v_length_dist',
            }, {
                title: 'V Nucleotides Matching Germline',
                key: 'v_match_dist',
            }, {
                title: 'J Gene Length',
                key: 'j_length_dist',
            }, {
                title: 'J Nucleotides Matching Germline',
                key: 'j_match_dist',
            }, {
                title: 'Copy Number',
                key: 'copy_number_dist',
            }];

            var filters = ['all', 'functional', 'nonfunctional', 'unique',
                           'unique_multiple', 'clones_all', 'clones_functional',
                           'clones_nonfunctional'];

            var changeZoom = function(min, max) {
                angular.forEach(columnPlots, function(
                    plot, i) {
                    angular.forEach(filters, function(filter, i) {
                        $('#' + plot.key + '_' +
                            filter).highcharts().xAxis[0].setExtremes(
                            min, max,
                            true);
                    });
                });
            }

            var getHeatmap = function(samples, filterType) {
                var def = $q.defer();
                $http({
                    method: 'GET',
                    url: APIService.getUrl() + 'v_usage/' + samples.join(',') +
                        '/' + filterType + '/' + $scope.showOutliers + '/' +
                        $scope.showPartials + '/' + $scope.grouping
                }).success(function(data, status) {
                    def.resolve(data);
                }).error(function(data, status, headers, config) {
                    def.reject();
                });

                return def.promise;
            }

            var reflowCharts = function(doV) {
                angular.forEach(filters, function(filter) {
                    // v_call heatmap for the filter
                    if (doV) {
                        $('#vHeatmap_' + filter).highcharts().reflow();
                    }
                    // All column plots for the filter
                    angular.forEach(columnPlots, function(plot, i) {
                        $('#' + plot.key + '_' +
                            filter).highcharts().reflow();
                    });
                });
            }

            var createColumns = function(filter) {
                $scope.charts[filter] = [];
                angular.forEach(columnPlots, function(p,
                    i) {
                    if (!(filter in $scope.charts)) {
                        $scope.charts[filter] = [];
                    }

                    var c = plotting.createColumnChart(
                            p.title,
                            p.key,
                            'Nucleotides',
                            filter.indexOf('clone') < 0 ? 'Sequences' :
                            'Clones',
                            plotting.createSeries(
                                $scope.stats, p.key, filter));
                    $scope.charts[filter].push(c);
                });
            }

            $scope.doRequest = function() {
                // Do the GET request for results
                $scope.showLoader()
                $http({
                    method: 'GET',
                    url: APIService.getUrl() + 'stats/' +
                        $routeParams['sampleIds'] + '/' +
                        $scope.showOutliers + '/' +
                        $scope.showPartials + '/' +
                        $scope.grouping
                }).success(function(data, status) {
                    $scope.allData = data;
                    $scope.updateAll(true);
                    $timeout(reflowCharts, 0);
                    $scope.hideLoader();
                }).error(function(data, status, headers, config) {
                    $scope.showError();
                });
            }

            $scope.updateAll = function() {
                $scope.sampleIds = $routeParams['sampleIds'].split(',');
                $scope.samples = $scope.allData['samples'];
                $scope.stats = $scope.allData['stats'];
                $scope.cnts = $scope.allData['counts'];

                // Determine if any requested IDs are not available
                $scope.missing = $routeParams['sampleIds'].split(
                    ',').filter(function(req) {
                        return !(req in $scope.samples);
                });

                // Create all the charts
                $scope.charts = {};
                angular.forEach(filters, function(filter, j) {
                    // v_call heatmap for the filter
                    getHeatmap($scope.sampleIds, filter)
                        .then(function(result) {
                            $('#vHeatmap_' + filter).highcharts(
                                plotting.createHeatmap(result, 'V Gene Utilization',
                                $scope.grouping != 'name'));
                    });
                    createColumns(filter);
                });
            }

            $scope.addPin = function() {
                var names = [];
                angular.forEach($scope.groupedStats, function(val, key) {
                    names.push(val['sample']['name']);
                });
                $scope.pins.addPin('Samples ' + names.join(', '));
                $scope.showNotify('This page has been pinned.');
            }

            var init = function() {
                $scope.showLoader()
                $scope.$parent.page_title = 'Sample Comparison';

                $('#funcTab a').click(function(e) {
                    if ($(this).parent('li').hasClass('active')) {
                        $($(this).attr('href')).hide();
                    } else {
                        e.preventDefault();
                        $(this).tab('show');
                    }

                    reflowCharts(true);
                });

                // Enable help tooltips
                $(function() {
                    $('[data-toggle="tooltip"]').tooltip({
                        'placement': 'top'
                    });
                });

                $scope.grouping = 'name';
                $scope.showOutliers = false;
                $scope.showPartials = false;

                $scope.selectedSamples = [];
                $timeout($scope.doRequest, 0);
            }
            init();
        }
    ]);
})();
