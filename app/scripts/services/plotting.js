(function() {
    'use strict';

    angular.module('ImmunologyApp').factory('plotting', ['$log', '$filter',
        function($log, $filter) {
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
                        key: key,

                        exporting: {
                            scale: 4,
                        },
                    }
                },

                createHeatmap: function(data, chart_title) {
                    return {
                        chart: {
                            type: 'heatmap',
                            height: 250 + data['y_categories'].length * 50
                        },

                        credits: {
                            enabled: false
                        },

                        title: {
                            text: chart_title
                        },

                        xAxis: {
                            categories: data['x_categories'],
                            labels: {
                                rotation: -45,
                                formatter: function() {
                                    return $filter('geneTies')(this.value);
                                },
                            },
                            title: 'IGHV Gene',
                        },

                        yAxis: {
                            categories: data['y_categories'],
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
                                return '<b>Sample:</b> ' + data['y_categories'][
                                        this.point.y] + '<br />' +
                                    '<b>Gene:</b> ' + $filter('geneTies')(data['x_categories'][this
                                        .point.x]) + '<br />' +
                                    '<b>% of Sample:</b> ' +
                                    Math.pow(Math.E, this.point.value).toFixed(2) + '%';
                            }
                        },

                        series: [{
                            data: data['data'].map(function(point) {
                                if (point[2] != 'none') {
                                    return [point[0], point[1], Math.log(point[2])];
                                }
                                return [point[0], point[1], 0];
                            }),
                            turboThreshold: 0
                        }],

                        exporting: {
                            sourceWidth: 2000
                        },
                    };
                },

                createSeries: function(plottable, seriesKey, type) {
                    var series = [];
                    angular.forEach(plottable, function(plot, i) {
                        var data = angular.fromJson(
                            plot['filters'][type][seriesKey]);
                        series.push({
                            name: plot['sample']['name'],
                            data: data,
                            turboThreshold: 0
                        });
                    });

                    return series;
                },

                numberGenes: function(groupedStats, field, filter) {
                    return genes;
                }
            };
        }
    ]);
})();
