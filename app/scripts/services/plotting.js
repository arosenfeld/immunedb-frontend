(function() {
    'use strict';

    angular.module('ImmunologyApp').factory('plotting', ['$log',
        function($log) {
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

                createHeatmap: function(data, chart_title) {
                    return {
                        chart: {
                            type: 'heatmap',
                            height: 250 + data['y_categories'].length *
                                50
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
                                rotation: -45
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
                                    '<b>Gene:</b> ' + data['x_categories'][this
                                        .point.x] + '<br />' +
                                    '<b>% of Sample:</b> ' + this.point.value + '%';
                            }
                        },

                        series: [{
                            data: data['data'],
                            turboThreshold: 0
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

                numberGenes: function(groupedStats, field, filter) {
                    return genes;
                }
            };
        }
    ]);
})();
