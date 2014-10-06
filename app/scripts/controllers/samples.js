(function() {
    'use strict';

    angular.module('ImmunologyApp') .controller('SampleCtrl', ['$scope',
            '$http', '$routeParams', '$log', 'plotting', 'clonePager',
            'apiUrl',
        function($scope, $http, $routeParams, $log, plotting, clonePager,
                apiUrl) {

            var columnPlots = [{
                title: 'CDR3 Length',
                key: 'cdr3_len_dist',
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
                'clones_nonfunctional'
            ];

            var getCounts = function() {
                var cnts = {};
                angular.forEach($scope.grouped_stats, function(value,
                    sample_id) {
                    for (var i in filters) {
                        var f = filters[i];
                        if (!(f in cnts)) {
                            cnts[f] = 0;
                        }
                        cnts[f] += parseInt(value[f].sequence_cnt);
                    }
                });

                return cnts;
            }

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

            var updateClone = function(filter, page) {
                clonePager.getClones(
                    $routeParams['sampleIds'].split(','),
                    filter, page)
                    .then(
                        function(result) {
                            $scope.clone_pager[filter] = result;
                        },
                        function(result) {
                        }
                    );
            }

            var init = function() {
                // Show the loading popup
                $scope.$parent.modal_head = 'Querying';
                $scope.$parent.modal_text =
                    'Loading data from database...';
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
                    url: apiUrl + 'stats',
                    params: {
                        "q": {
                            "filters": [{
                                "name": "sample_id",
                                "op": "in",
                                "val": $routeParams['sampleIds']
                                    .split(',')
                            }]
                        }
                    }
                }).success(function(data, status) {
                    // Group the stats by sample ID, then filter
                    $scope.grouped_stats = {}
                    angular.forEach(data['objects'], function(data,
                        i) {
                        if (!(data.sample_id in $scope.grouped_stats)) {
                            $scope.grouped_stats[data.sample_id] = {
                                'sample': data.sample
                            }
                        }
                        $scope.grouped_stats[data.sample_id][
                            data.filter_type
                        ] = data;
                    });
                    $scope.meta = [];
                    angular.forEach($scope.grouped_stats, function(
                        v, i) {
                        $scope.meta.push(v);
                    });

                    // Determine if any requested IDs are not available
                    $scope.missing =
                        $routeParams['sampleIds'].split(',').filter(
                            function(req) {
                                return !(req in $scope.grouped_stats);
                            });

                    // Count how many sequences are in each filter
                    $scope.cnts = getCounts();

                    // Create all the charts
                    $scope.plottable = angular.fromJson($scope.grouped_stats);
                    $scope.charts = {};
                    angular.forEach(filters, function(filter, j) {
                        // v_call heatmap for the filter
                        var field = (filter.charAt(0).toUpperCase() +
                            filter.slice(1)).replace('_',
                            '');
                        $('#vHeatmap' + field).highcharts(
                            plotting.createHeatmap(
                                $scope.grouped_stats,
                                'V Gene Utilization',
                                filter,
                                'v_call_dist'));

                        // All the column charts for the filter
                        angular.forEach(columnPlots, function(p,
                            i) {
                            if (!(filter in $scope.charts)) {
                                $scope.charts[filter] = {};
                            }
                            var c =
                                plotting.createColumnChart(
                                    p.title,
                                    p.key,
                                    'Nucleotides',
                                    filter.indexOf('clone') < 0 ? 'Sequences' :
                                    'Clones',
                                    plotting.createSeries(
                                        $scope.plottable, p
                                        .key, filter)
                                );
                            $scope.charts[filter][p.key] = c;
                        });
                    });

                    $('#modal').modal('hide');
                }).error(function(data, status, headers, config) {
                    $scope.$parent.modal_head = 'Error';
                    $scope.$parent.modal_text =
                        'There has been an error communicating with the database. If this occurs again, please contact <a href="mailto:ar374@drexel.edui?subject=SimLab DB Error">ar374@drexel.edu</a>.';
                });

                $scope.clone_pager = {};
                angular.forEach(filters, function(filter, j) {
                    if (filter.indexOf('clones') >= 0) {
                        updateClone(filter, 1);
                    }
                });

                // REMOVE
                $scope.updateClone = updateClone;
            }
            init();
        }
    ]);
})();
