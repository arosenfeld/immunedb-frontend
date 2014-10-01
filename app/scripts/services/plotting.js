(function() {
    'use strict';

    angular.module('ImmunologyApp').factory('plotting', ['$log',
        function($log) {
            var geneConfuse = {
                "IGHV1-18": "IGHV1-18",
                "IGHV1-2": "IGHV1-2",
                "IGHV1-24": "IGHV1-24",
                "IGHV1-3": "IGHV1-3",
                "IGHV1-45": "IGHV1-45",
                "IGHV1-46": "IGHV1-46",
                "IGHV1-58": "IGHV1-58",
                "IGHV1-69": "IGHV1-69",
                "IGHV1-8": "IGHV1-8",
                "IGHV1-f": "IGHV1-f",
                "IGHV2-26": "IGHV2-26",
                "IGHV2-5": "IGHV2-5",
                "IGHV2-70": "IGHV2-70",
                "IGHV3-11": "IGHV3-11|IGHV3-48",
                "IGHV3-13": "IGHV3-13",
                "IGHV3-15": "IGHV3-15",
                "IGHV3-20": "IGHV3-20",
                "IGHV3-21": "IGHV3-21",
                "IGHV3-23": "IGHV3-23",
                "IGHV3-30": "IGHV3-30|IGHV3-30-3|IGHV3-33",
                "IGHV3-30-3": "IGHV3-30-3|IGHV3-30",
                "IGHV3-33": "IGHV3-33|IGHV3-30",
                "IGHV3-43": "IGHV3-43",
                "IGHV3-48": "IGHV3-48|IGHV3-11",
                "IGHV3-49": "IGHV3-49",
                "IGHV3-53": "IGHV3-53|IGHV3-66",
                "IGHV3-64": "IGHV3-64",
                "IGHV3-66": "IGHV3-66|IGHV3-53",
                "IGHV3-7": "IGHV3-7",
                "IGHV3-72": "IGHV3-72",
                "IGHV3-73": "IGHV3-73",
                "IGHV3-74": "IGHV3-74",
                "IGHV3-9": "IGHV3-9",
                "IGHV3-NL1": "IGHV3-NL1",
                "IGHV3-d": "IGHV3-d",
                "IGHV4-28": "IGHV4-28",
                "IGHV4-30-2": "IGHV4-30-2|IGHV4-30-4|IGHV4-39",
                "IGHV4-30-4": "IGHV4-30-4|IGHV4-30-2",
                "IGHV4-31": "IGHV4-31|IGHV4-59",
                "IGHV4-34": "IGHV4-34",
                "IGHV4-39": "IGHV4-39|IGHV4-59|IGHV4-b|IGHV4-30-2",
                "IGHV4-4": "IGHV4-4|IGHV4-59|IGHV4-61",
                "IGHV4-59": "IGHV4-59|IGHV4-61|IGHV4-31|IGHV4-39|IGHV4-4",
                "IGHV4-61": "IGHV4-61|IGHV4-4|IGHV4-59",
                "IGHV4-b": "IGHV4-b|IGHV4-39",
                "IGHV5-51": "IGHV5-51",
                "IGHV5-a": "IGHV5-a",
                "IGHV6-1": "IGHV6-1",
                "IGHV7-4-1": "IGHV7-4-1"
            };

            return {

                createColumnChart: function(chart_title, key, x_label,
                                            y_label, all_series) {
                    return {
                        options: {
                            chart: {
                                type: 'column',
                                zoomType: 'x',
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
                },

                createHeatmap: function(grouped_stats, chart_title, filter,
                                        type) {
                    var geneToId = {};
                    var idToGene = {};

                    var genes = [];
                    for (var sample_id in grouped_stats) {
                        var occ =
                            angular.fromJson(grouped_stats[sample_id][
                                filter
                            ][type]);
                        angular.forEach(occ, function(value, key) {
                            var rename = geneConfuse[value[0]];
                            if (typeof rename != 'undefined' &&
                                genes.indexOf(
                                    rename) < 0) {
                                genes.push(rename);
                            }

                            if (typeof rename == 'undefined') {
                                var n = 
                                    value[0].replace('/', '|').split('|')[0];
                                if (genes.indexOf(n) < 0) {
                                    genes.push(n);
                                }
                            }
                        });
                    }

                    var x_categories = genes;
                    x_categories.push('Other');
                    var y_categories = Object.keys(grouped_stats).map(
                        function(e) {
                            return parseInt(e);
                        });
                    var y_names = [];
                    angular.forEach(grouped_stats, function(stat, i) {
                        y_names.push(stat.sample.name);
                    });

                    var data = [];
                    for (var x in x_categories) {
                        for (var y in y_categories) {
                            data.push([parseInt(x), parseInt(y), 0]);
                        }
                    }

                    angular.forEach(grouped_stats, function(value,
                        sample_id) {
                        var dist = angular.fromJson(value[filter][
                            type
                        ]);

                        grouped_stats[sample_id][filter][
                            'plotted_cnt'
                        ] =
                            0;
                        var aliased = {}
                        angular.forEach(dist, function(value, key) {
                            value[0] = value[0].replace('/', '|').split('|')[0];
                            var gene = geneConfuse[value[0]];
                            if (typeof gene == 'undefined') {
                                gene = 'Other';
                            }

                            var x = x_categories.indexOf(gene);
                            if (x >= 0) { // TODO: Fix this
                                var z = value[1];

                                if (!(x in aliased)) {
                                    aliased[x] = 0;
                                }
                                aliased[x] += z;

                                grouped_stats[sample_id][filter][
                                    'plotted_cnt'
                                ] += z;
                            }
                        });

                        for (var x in aliased) {
                            data.push([parseInt(x), y_categories.indexOf(
                                    parseInt(sample_id)),
                                Math.log(aliased[x])
                            ]);
                        }
                    });

                    return {
                        chart: {
                            type: 'heatmap',
                            height: 250 + Object.keys(grouped_stats).length *
                                50
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
                                rotation: -45
                            },
                            title: 'IGHV Gene',
                        },

                        yAxis: {
                            categories: y_names,
                            reversed: true,
                            title: 'Sample ID',
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
                            },
                        },

                        tooltip: {
                            style: {
                                padding: 20,
                            },
                            formatter: function() {
                                var v = 100 * Math.round(
                                        Math.pow(Math.E,
                                            this.point.value)) /
                                    grouped_stats[y_categories[this.point
                                        .y]][filter]['plotted_cnt'];
                                return '<b>Sample:</b> ' + y_categories[
                                        this.point.y] + '<br />' +
                                    '<b>Gene:</b> ' + x_categories[this
                                        .point.x] + '<br />' +
                                    '<b>% of Sample:</b> ' + v.toFixed(
                                        2) + '%';
                            }
                        },

                        series: [{
                            data: data,
                        }]
                    };
                },

                createSeries: function(plottable, series_key, type) {
                    var series = [];
                    for (var i in plottable) {
                        series.push({
                            name: plottable[i]['sample']['name'],
                            data: angular.fromJson(
                                plottable[i][type][series_key]),
                            turboThreshold: 0
                        });
                    }
                    return series;
                },

                numberGenes: function(grouped_stats, field, filter) {
                    return genes;
                }
            };
        }
    ]);
})();
