(function() {
    'use strict';

    angular.module('ImmunologyApp') .controller('SampleCtrl', ['$scope',
            '$http', '$routeParams', '$log', '$q', 'plotting', '$timeout',
            'APIService',
        function($scope, $http, $routeParams, $log, $q, plotting, $timeout, APIService) {

            var plots = [{
                title: 'CDR3 Length',
                key: 'cdr3_length_dist',
                type: 'column',
            }, {
                title: 'V Gene Length',
                key: 'v_length_dist',
                type: 'column',
            }, {
                title: 'V Nucleotides Matching Germline',
                key: 'v_match_dist',
                type: 'column',
            }, {
                title: 'Percentage of V Nucleotides Matching Germline',
                key: 'v_identity_dist',
                xlabel: 'Percentage',
                type: 'column',
            }, {
                title: 'J Gene Length',
                key: 'j_length_dist',
                type: 'column',
            }, {
                title: 'J Nucleotides Matching Germline',
                key: 'j_match_dist',
                type: 'column',
            }, {
                title: 'Phred Quality Score',
                xlabel: 'Position',
                ylabel: 'Avg. Phred Quality Score',
                key: 'quality_dist',
                type: 'line',
            },{
                title: 'Copy Number',
                key: 'copy_number_dist',
                xlabel: 'Copies',
                type: 'column',
            }];

            var filters = ['all', 'functional', 'nonfunctional', 'unique',
                           'unique_multiple', 'clones_all', 'clones_functional',
                           'clones_nonfunctional'];

            var getHeatmap = function(samples, filterType) {
                var url = 'v_usage/' + samples.join(',') +
                        '/' + filterType + '/' + $scope.showOutliers + '/' +
                        $scope.showPartials + '/' + $scope.grouping + '/' +
                        $scope.byFamily;
                var def = $q.defer();
                $http({
                    method: 'GET',
                    url: APIService.getUrl() + url
                }).success(function(data, status) {
                    def.resolve({
                        data: data,
                        url: APIService.getUrl() + 'data/' + url
                    });
                }).error(function(data, status, headers, config) {
                    def.reject();
                });

                return def.promise;
            }

            var getRarefaction = function(samples) {
                var def = $q.defer();
                $http({
                    method: 'GET',
                    url: APIService.getUrl() + 'rarefaction/' +
                        samples.join(',') + '/' + $scope.rarefactionMode +
                        '/false/1/' + ($scope.rarefactionPoints || 0),
                    params: {
                        'reps': 100
                    },
                }).success(function(data, status) {
                    def.resolve(data['rarefaction']);
                }).error(function(data, status, headers, config) {
                    def.reject();
                });

                return def.promise;
            }

            var getDiversity = function(samples) {
                var def = $q.defer();
                $http({
                    method: 'GET',
                    url: APIService.getUrl() + 'diversity/' +
                        samples.join(',') + '/1/1'
                }).success(function(data, status) {
                    def.resolve(data['diversity']);
                }).error(function(data, status, headers, config) {
                    def.reject();
                });

                return def.promise;
            }

            var reflowCharts = function(doV) {
                angular.forEach(filters, function(filter) {
                    // v_call heatmap for the filter
                    if (doV) {
                        var chart = $('#vHeatmap_' + filter).highcharts();
                        if (typeof chart != 'undefined') {
                            chart.reflow();
                        }
                    }
                    // All column plots for the filter
                    angular.forEach(plots, function(plot, i) {
                        if (!(filter.indexOf('clone') >= 0 && plot.key == 'quality_dist')) {
                            $('#' + plot.key + '_' + filter).highcharts().reflow();
                        }
                    });
                });
            }

            var createPlots = function(filter) {
                $scope.charts[filter] = [];
                angular.forEach(plots, function(p, i) {

                    if (!(filter.indexOf('clone') >= 0 && p.key == 'quality_dist')) {
                        if (!(filter in $scope.charts)) {
                            $scope.charts[filter] = [];
                        }

                        var xl, yl;
                        if (typeof p.xlabel == 'undefined') {
                            xl = 'Nucleotides';
                        } else {
                            xl = p.xlabel;
                        }
                        if (typeof p.ylabel == 'undefined') {
                            if (filter.indexOf('clone') < 0) {
                                yl = 'Sequences';
                            } else {
                                yl = 'Clones';
                            }
                        } else {
                            yl = p.ylabel;
                        }

                        var c = plotting.createPlot(
                                p.title,
                                p.key,
                                xl,
                                yl,
                                p.type,
                                plotting.createSeries(
                                    $scope.stats, p.key, filter));
                        $scope.charts[filter].push(c);
                    }
                });
            }

            $scope.rarefactionModes = {
                'sample': 'Sample Based',
                'individual': 'Individual Based',
                'individual_emp': 'Individual Based (Emperical)'
            };

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
                            var data = result['data'];
                            var url = result['url'];
                            if (data.x_categories.length > 0) {
                                $('#vHeatmap_' + filter).highcharts(
                                    plotting.createHeatmap(data, 'V Gene Utilization (Excludes Genes in < 1% of ' + (
                                        filter.indexOf('clones') >= 0 ? 'Clones' : 'Sequences') + ')', url));
                            }
                    });
                    createPlots(filter);
                });
            }

            $scope.addPin = function() {
                var names = [];
                angular.forEach($scope.samples, function(sample) {
                    names.push(sample.name);
                });
                $scope.pins.addPin('Samples ' + names.join(', '));
                $scope.showNotify('This page has been pinned.');
            }

            $scope.generateRarefaction = function() {
                $scope.rarefactionStatus = 'loading';
                getRarefaction($routeParams['sampleIds'].split(','))
                        .then(function(result) {
                            $('#rarefaction').highcharts(
                                plotting.createPlot(
                                    "Clone Rarefaction",
                                    "clone_rarefaction",
                                    "Subsamples",
                                    "E[clones]",
                                    'line',
                                    result));
                            $('#rarefaction').highcharts().reflow();
                            $scope.rarefactionStatus = 'loaded';
                        });
            }

            $scope.generateDiversity = function() {
                $scope.diversityStatus = 'loading';
                getDiversity($routeParams['sampleIds'].split(','))
                        .then(function(result) {
                            $('#diversity').highcharts(
                                plotting.createPlot(
                                    "Sequence Diversity",
                                    "sequence_diversity",
                                    "Position",
                                    "Diversity",
                                    'line',
                                    [{
                                        name: 'Diversity',
                                        data: result
                                    }]));
                            $('#diversity').highcharts().reflow();
                            $scope.diversityStatus = 'loaded';
                        });
            }

            $scope.setRarefactionMode = function(mode) {
                $log.debug(mode);
                $scope.rarefactionMode = mode;
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
                $scope.byFamily = false;
                $scope.showOutliers = false;
                $scope.showPartials = false;

                $scope.rarefactionStatus = 'none';
                $scope.rarefactionMode = 'sample';

                $scope.diversityStatus = 'none';

                $scope.selectedSamples = [];
                $timeout($scope.doRequest, 0);
            }
            init();
        }
    ]);
})();
