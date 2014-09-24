'use strict';

angular.module('ImmunologyApp')
    .controller('SampleCtrl', ['$scope', '$http', '$routeParams', '$log', 'apiUrl',
        function($scope,
            $http, $routeParams, $log, apiUrl) {

            var geneConfuse = {
                'IGHV6-1': 'IGHV6-1',
                'IGHV4-4': 'IGHV4-30-2',
                'IGHV3-20': 'IGHV3-20',
                'IGHV3-15': 'IGHV3-15',
                'IGHV1-18': 'IGHV1-18',
                'IGHV3-11': 'IGHV3-48',
                'IGHV5-51': 'IGHV5-51',
                'IGHV3-13': 'IGHV3-13',
                'IGHV3-53': 'IGHV3-30',
                'IGHV3-33': 'IGHV3-NL1',
                'IGHV3-30': 'IGHV3-NL1',
                'IGHV3-73': 'IGHV3-73',
                'IGHV3-72': 'IGHV3-72',
                'IGHV2-26': 'IGHV2-26',
                'IGHV3-74': 'IGHV3-74',
                'IGHV2-5': 'IGHV2-70',
                'IGHV3-49': 'IGHV3-49',
                'IGHV3-7': 'IGHV3-48',
                'IGHV1-8': 'IGHV1-8',
                'IGHV3-9': 'IGHV3-9',
                'IGHV3-30-3': 'IGHV3-NL1',
                'IGHV1-3': 'IGHV1-3',
                'IGHV1-2': 'IGHV1-2',
                'IGHV3-43': 'IGHV3-43',
                'IGHV4-39': 'IGHV4-30-2',
                'IGHV1-45': 'IGHV1-45',
                'IGHV4-34': 'IGHV4-61',
                'IGHV1-69': 'IGHV1-69',
                'IGHV4-59': 'IGHV4-30-2',
                'IGHV4-31': 'IGHV4-31',
                'IGHV1-24': 'IGHV1-24',
                'IGHV3-23': 'IGHV3-23',
                'IGHV4-30-4': 'IGHV4-30-2',
                'IGHV2-70': 'IGHV2-70',
                'IGHV4-30-2': 'IGHV4-30-2',
                'IGHV3-48': 'IGHV3-48',
                'IGHV4-28': 'IGHV4-39',
                'IGHV3-64': 'IGHV3-NL1',
                'IGHV1-46': 'IGHV1-46',
                'IGHV3-66': 'IGHV3-NL1',
                'IGHV1-f': 'IGHV1-f',
                'IGHV4-61': 'IGHV4-61',
                'IGHV7-4-1': 'IGHV7-4-1',
                'IGHV3-NL1': 'IGHV3-NL1',
                'IGHV3-d': 'IGHV3-d',
                'IGHV1-58': 'IGHV1-58',
                'IGHV4-b': 'IGHV4-61',
                'IGHV5-a': 'IGHV5-51',
                'IGHV3-21': 'IGHV3-48',
            };

            var createColumnChart = function(chart_title, key, x_label, y_label,
                all_series) {

                return {
                    options: {
                        chart: {
                            type: 'column',
                            zoomType: 'x'
                        }
                    },
                    credits: {
                        enabled: false
                    },
                    title: {
                        text: chart_title
                    },

                    xAxis: {
                        title: {
                            text: x_label
                        }
                    },

                    yAxis: {
                        title: {
                            text: y_label
                        }
                    },

                    loading: false,
                    series: all_series,
                    key: key
                }
            }

            var createHeatmap = function(label, chart_title, filter,
                type) {

                var genes = numberGenes(type, filter);
                var x_categories = genes;
                var y_categories = Object.keys($scope.grouped_stats).map(
                    function(e) {
                        return parseInt(e);
                });

                var data = [];
                for (var x in x_categories) {
                    for (var y in y_categories) {
                        data.push([parseInt(x), parseInt(y), 0]);
                    }
                }

                $scope.cnts = {}

                angular.forEach($scope.grouped_stats, function(value, sample_id) {
                    for (var i in filters) {
                        var f = filters[i];
                        if (!(f in $scope.cnts)) {
                            $scope.cnts[f] = 0;
                        }
                        $scope.cnts[f] += parseInt(value[f].sequence_cnt);
                    }
                    var dist = angular.fromJson(value[filter][type]);

                    $scope.grouped_stats[sample_id][filter]['plotted_cnt'] = 0;
                    var aliased = {}
                    angular.forEach(dist, function(value, key) {
                        var gene = geneConfuse[value[0]];
                        if (typeof gene != 'undefined') {
                            var x = x_categories.indexOf(gene);
                            var z = value[1];

                            if (!(x in aliased)) {
                                aliased[x] = 0;
                            }
                            aliased[x] += z;

                            $scope.grouped_stats[sample_id][filter]['plotted_cnt']
                                += z;
                        }
                    });

                    for (var x in aliased) {
                        data.push([parseInt(x), y_categories.indexOf(parseInt(sample_id)),
                            Math.log(aliased[x])]);
                    }
                });


                $(label).highcharts({
                    chart: {
                        type: 'heatmap',
                    },

                    credits: {
                        enabled: false
                    },

                    title: {
                        text: chart_title
                    },

                    xAxis: {
                        categories: x_categories,
                        labels: {
                            rotation: -90
                        },
                        title: 'IGHV Gene'
                    },

                    yAxis: {
                        categories: y_categories,
                        title: 'Sample ID'
                    },

                    colorAxis: {
                        min: 0,
                        minColor: '#000000',
                        maxColor: '#ff0000',
                    },

                    legend: {
                        enabled: false,
                        align: 'right',
                        layout: 'vertical',
                        margin: 0,
                        verticalAlign: 'middle',
                        symbolHeight: 255,
                        y: -30,
                        title: {
                            text: 'log(# Seq.)',
                        }
                    },

                    tooltip: {
                        style: {
                            padding: 20,
                        },
                        formatter: function() {
                            var v = 100 * Math.pow(Math.E, this.point.value) /
                                $scope.grouped_stats[y_categories[this.point.y]][filter]['plotted_cnt'];
                            return '<b>Sample:</b> ' + y_categories[this.point.y] + '<br />' +
                                '<b>Gene:</b> ' + x_categories[this.point.x] + '<br />' +
                                '<b>Value:</b> ' + v.toFixed(2) + '%';
                        }
                    },

                    series: [{
                        data: data,
                    }]
                });
            }

            var createSeries = function(series_key, type) {
                var series = [];
                for (var i in $scope.plottable) {
                    series.push({
                        name: $scope.plottable[i]['sample']['name'],
                        data: angular.fromJson($scope.plottable[i][type][series_key]),
                        turboThreshold: 0
                    });
                }
                return series;
            }

            var numberGenes = function(field, filter) {
                var geneToId = {};
                var idToGene = {};

                var genes = [];
                for (var sample_id in $scope.grouped_stats) {
                    var occ =
                        angular.fromJson($scope.grouped_stats[sample_id][filter][field]);
                    angular.forEach(occ, function(value, key) {
                        var rename = geneConfuse[value[0]];
                        if (typeof rename != 'undefined' && genes.indexOf(rename) < 0) {
                            genes.push(rename);
                        }
                    });
                }

                return genes;
            }

            var plots = [{
                title: 'CDR3 Length',
                xl: 'Nucleotides',
                yl: 'Sequences',
                key: 'cdr3_len_dist',
            }, {
                title: 'V Gene Length',
                xl: 'Nucleotides',
                yl: 'Sequences',
                key: 'v_length_dist',
            }, {
                title: 'V Nucleotides Matching Germline',
                xl: 'Nucleotides',
                yl: 'Sequences',
                key: 'v_match_dist',
            }, {
                title: 'J Gene Length',
                xl: 'Nucleotides',
                yl: 'Sequences',
                key: 'j_length_dist',
            }, {
                title: 'J Nucleotides Matching Germline',
                xl: 'Nucleotides',
                yl: 'Sequences',
                key: 'j_match_dist',
            }, ];

            var filters = ['all', 'functional', 'nonfunctional', 'unique',
                'unique_multiple'
            ];

            var init = function() {
                $('#loading').modal('show');

                $('#funcTab a').click(function(e) {
                    if ($(this).parent('li').hasClass('active')) {
                        $($(this).attr('href')).hide();
                    } else {
                        e.preventDefault();
                        $(this).tab('show');
                    }

                    for (var i = 0; i < plots.length; i++) {
                        for (var j = 0; j < filters.length; j++) {
                            $('#' + plots[i].key + '_' +
                                filters[j]).highcharts().reflow();
                        }
                    }
                    $('#vHeatmapAll').highcharts().reflow();
                    $('#vHeatmapFunctional').highcharts().reflow();
                    $('#vHeatmapNonFunctional').highcharts().reflow();
                    $('#vHeatmapUnique').highcharts().reflow();
                    $('#vHeatmapUniqueMultiple').highcharts().reflow();
                });

                $http({
                    method: 'GET',
                    url: apiUrl + 'stats',
                    params: {
                        "q": {
                            "filters": [{
                                "name": "sample_id",
                                "op": "in",
                                "val": $routeParams['sampleIds'].split(',')
                            }]
                        }
                    }
                }).success(function(data, status) {
                    $scope.stats = data['objects'];
                    $scope.grouped_stats = {}
                    for (var e in $scope.stats) {
                        var data = $scope.stats[e];
                        if (!(data.sample_id in $scope.grouped_stats)) {
                            $scope.grouped_stats[data.sample_id] = {
                                'sample': data.sample
                            }
                        }
                        $scope.grouped_stats[data.sample_id][data.filter_type] = data;
                    }

                    $scope.plottable = angular.fromJson($scope.grouped_stats);
                    $scope.charts = {};
                    for (var i = 0; i < plots.length; i++) {
                        var p = plots[i];
                        // TODO: Redo these loops
                        for (var j = 0; j < filters.length; j++) {
                            if (!(filters[j] in $scope.charts)) {
                                $scope.charts[filters[j]] = {};
                            }
                            $scope.charts[filters[j]][p.key] = createColumnChart(
                                p.title,
                                p.key,
                                p.xl,
                                p.yl,
                                createSeries(p.key, filters[j])
                            );
                        }
                    }

                    createHeatmap(
                        '#vHeatmapAll',
                        'V Gene Utilization',
                        'all',
                        'v_call_dist');
                    createHeatmap(
                        '#vHeatmapFunctional',
                        'V Gene Utilization',
                        'functional',
                        'v_call_dist');
                    createHeatmap(
                        '#vHeatmapNonFunctional',
                        'V Gene Utilization',
                        'nonfunctional',
                        'v_call_dist');
                    createHeatmap(
                        '#vHeatmapUnique',
                        'V Gene Utilization',
                        'unique',
                        'v_call_dist');
                    createHeatmap(
                        '#vHeatmapUniqueMultiple',
                        'V Gene Utilization',
                        'unique_multiple',
                        'v_call_dist');

                    $(function() {
                        $('[data-toggle="tooltip"]').tooltip({
                            'placement': 'top'
                        });
                    });

                    $('#loading').modal('hide');
                }).error(function(data, status, headers, config) {
                    $('#loading').modal('hide');
                    $('#error').modal('show');
                });
            }

            init();
        }
    ]);
