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
            }, ];

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

            var getHeatmap = function(filter_type, samples, type) {
                var def = $q.defer();
                $http({
                    method: 'GET',
                    url: APIService.getUrl() + type + '/' + filter_type + '/' +
                        samples.join(',')
                }).success(function(data, status) {
                    def.resolve(data);
                }).error(function(data, status, headers, config) {
                    def.reject();
                });

                return def.promise;
            }

            var init = function() {
                // Show the loading popup
                $scope.$parent.modal_head = 'Querying';
                $scope.$parent.modal_text =
                    'Loading data from database...';
                $scope.$parent.page_title = 'Sample Comparison';
                $('#modal').modal('show');

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
                    // Group the stats by sample ID, then filter
                    $scope.sampleIds = $routeParams['sampleIds'].split(',');
                    $scope.groupedStats = data['stats']['stats'];
                    $scope.cnts = data['stats']['counts'];

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
                        getHeatmap(filter, $scope.sampleIds, 'v_usage')
                            .then(function(result) {
                            var field = (filter.charAt(0).toUpperCase() +
                                filter.slice(1)).replace('_',
                                '');
                            $('#vHeatmap' + field).highcharts(
                                plotting.createHeatmap(result, 'V Gene Utilization'));
                        });

                        // All the column charts for the filter
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
                                        $scope.plottable, p.key, filter)
                                );
                            $scope.charts[filter].push(c);
                        });
                    });

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
