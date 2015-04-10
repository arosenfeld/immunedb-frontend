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

                createLinePlot: function(chartTitle, x_label,
                                         y_label, series) {
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
                            min: 0,
                            title: {
                                text: y_label
                            }
                        },

                        loading: false,

                        series: [{
                            name: 'Rarefaction',
                            data: series
                        }],

                        exporting: {
                            scale: 4,
                        },

                        legend: {
                            enabled: false,
                        },

                        tooltip: {
                            formatter: function() {
                                return '<b>Subsamples:</b> ' + this.point.x + '<br/>' +
                                '<b>E[clones]:</b> ' + this.point.y.toFixed(2);
                            }
                        },
                    }
                },

                createHeatmap: function(data, chartTitle, exportUrl) {
                    return {
                        chart: {
                            type: 'heatmap',
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
                                    return this.value + ' (' +
                                    data.totals[this.value] + ')';
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
                                return [point[0], point[1], point[2] == 0 ?
                                    0 : Math.log(point[2])];
                            }),
                            turboThreshold: 0
                        }],

                        exporting: {
                            sourceWidth: 2000,
                            buttons: {
                                contextButton: {
                                    menuClassName: 'highcharts-contextmenu',
                                    symbol: 'menu',
                                    _titleKey: 'contextButtonTitle',
                                    menuItems: [{
                                        textKey: 'printChart',
                                        onclick: function () {
                                            this.print();
                                        }
                                    }, {
                                        separator: true
                                    }, {
                                        textKey: 'downloadPNG',
                                        onclick: function () {
                                            this.exportChart();
                                        }
                                    }, {
                                        textKey: 'downloadJPEG',
                                        onclick: function () {
                                            this.exportChart({
                                                type: 'image/jpeg'
                                            });
                                        }
                                    }, {
                                        textKey: 'downloadPDF',
                                        onclick: function () {
                                            this.exportChart({
                                                type: 'application/pdf'
                                            });
                                        }
                                    }, {
                                        textKey: 'downloadSVG',
                                        onclick: function () {
                                            this.exportChart({
                                                type: 'image/svg+xml'
                                            });
                                        }
                                    }, {
                                        text: 'Download CSV',
                                        onclick: function () {
                                            window.open(exportUrl);
                                        }
                                    }]
                                }
                            }
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
