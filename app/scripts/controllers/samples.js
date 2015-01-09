(function() {
    'use strict';

    angular.module('ImmunologyApp') .controller('SampleCtrl', ['$scope',
            '$http', '$routeParams', '$log', '$q', 'plotting',
            'APIService',
        function($scope, $http, $routeParams, $log, $q, plotting, APIService) {

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
                    url: APIService.getUrl() + 'v_usage/' + filterType + '/' +
                        $scope.showOutliers + '/' + !$scope.showPartials +
                        '/' + samples.join(',')
                }).success(function(data, status) {
                    def.resolve(data);
                }).error(function(data, status, headers, config) {
                    def.reject();
                });

                return def.promise;
            }

            var createColumns = function(filter) {
                $scope.charts[filter] = [];
                angular.forEach(columnPlots, function(p,
                    i) {
                    if (!(filter in $scope.charts)) {
                        $scope.charts[filter] = [];
                    }

                    var c =
                        plotting.createColumnChart(
                            p.title,
                            p.key,
                            'Nucleotides',
                            filter.indexOf('clone') < 0 ? 'Sequences' :
                            'Clones',
                            plotting.createSeries(
                                $scope.plottable, p.key, filter));
                    $scope.charts[filter].push(c);
                });
            }

            $scope.updateAll = function() {
                // Group the stats by sample ID, then filter
                var outlierKey = $scope.showOutliers ? 'outliers' : 'no_outliers';
                var readKey = $scope.showPartials ? 'all_reads' : 'full_reads';
                $scope.sampleIds = $routeParams['sampleIds'].split(',');
                $scope.groupedStats = $scope.allData[outlierKey][readKey]['stats'];
                $scope.cnts = $scope.allData[outlierKey][readKey]['counts'];

                // Determine if any requested IDs are not available
                $scope.missing =
                    $routeParams['sampleIds'].split(',').filter(
                        function(req) {
                            return !(req in $scope.groupedStats);
                        });

                // Create all the charts
                $scope.plottable = angular.fromJson($scope.groupedStats);
                $scope.charts = {};
                angular.forEach(filters, function(filter, j) {
                    // v_call heatmap for the filter
                    getHeatmap($scope.sampleIds, filter)
                        .then(function(result) {
                            var field = (filter.charAt(0).toUpperCase() +
                                filter.slice(1)).replace('_',
                                '');
                            $('#vHeatmap' + field).highcharts(
                                plotting.createHeatmap(result, 'V Gene Utilization'));
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

                // Resize (reflow) all plots when a tab is clicked
                $('#funcTab a').click(function(e) {
                    if ($(this).parent('li').hasClass('active')) {
                        $($(this).attr('href')).hide();
                    } else {
                        e.preventDefault();
                        $(this).tab('show');
                    }

                    angular.forEach(filters, function(filter, j) {
                        // v_call heatmap for the filter
                        $('#vHeatmap' + (filter.charAt(0).toUpperCase() +
                            filter.slice(1)).replace('_',
                            ''))
                            .highcharts().reflow();
                        // All column plots for the filter
                        angular.forEach(columnPlots, function(
                            plot, i) {
                            $('#' + plot.key + '_' +
                                filter).highcharts().reflow();
                        });
                    });
                });

                // Enable help tooltips
                $(function() {
                    $('[data-toggle="tooltip"]').tooltip({
                        'placement': 'top'
                    });
                });

                // Do the GET request for results
                $http({
                    method: 'GET',
                    url: APIService.getUrl() + 'stats/' +
                        $routeParams['sampleIds'],
                }).success(function(data, status) {
                    $scope.allData = data;
                    $scope.showOutliers = false;
                    $scope.showPartials = false;
                    $scope.selectedSamples = [];
                    $scope.updateAll();
                    $scope.hideLoader();
                }).error(function(data, status, headers, config) {
                    $scope.showError();
                });
            }
            init();
        }
    ]);
})();
