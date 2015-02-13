(function() {
    'use strict';

    angular.module('ImmunologyApp').factory('plotting', ['$log', '$filter',
            'lookups',
        function($log, $filter, lookups) {
            return {
                createColumnChart: function(chartTitle, key, x_label,
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
                            text: chartTitle
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

                createHeatmap: function(data, chartTitle, color) {
                    return {
                        chart: {
                            type: 'heatmap',
                            height: 250 + data['y_categories'].length * 25
                        },

                        credits: {
                            enabled: false
                        },

                        title: {
                            text: chartTitle
                        },

                        xAxis: {
                            categories: data['x_categories'],
                            labels: {
                                rotation: -90,
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
                            labels: {
                                formatter: function() {
                                    if (color) {
                                        var c =
                                            lookups.grpColors[data['lookup'][this.value] % lookups.grpColors.length];
                                            return '<span style="color: ' + c + '">' +
                                            this.value + '</span>';
                                    }
                                    return this.value;
                                },
                            },
                        },

                        colorAxis: {
                            min: 0,
                            stops: [
                                [0, '#0000ff'],
                                [.5, '#ffffff'],
                                [1, '#ff0000'],
                            ],
                        },

                        legend: {
                            enabled: false,
                            align: 'right',
                            layout: 'vertical',
                            margin: 0,
                            verticalAlign: 'middle',
                            symbolHeight: 255,
                            y: -30,
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
                                    (this.point.value == 0 ? 0 :
                                    Math.exp(this.point.value)).toFixed(2) + '%';
                            }
                        },

                        series: [{
                            data: data['data'].map(function(point) {
                                if (point[2] != 'none') {
                                    return [point[0], point[1],
                                    point[2] == 0 ? 0 : Math.log(point[2])];
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

                createSeries: function(data, seriesKey, type) {
                    var series = [];
                    angular.forEach(data, function(plot, name) {
                        series.push({
                            name: name,
                            data: plot[type][seriesKey],
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
