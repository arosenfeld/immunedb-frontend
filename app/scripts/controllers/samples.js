'use strict';

angular.module('ImmunologyApp')
  .controller('SampleCtrl', [ '$scope', '$http', '$routeParams', 'apiUrl', function ($scope,
      $http, $routeParams, apiUrl) {

    var createColumnChart = function(chart_title, x_label, y_label, all_series) {
        var basicBarConfig = {
            options: {
                chart: {
                    type: 'column'
                }
            },
            credits: {
                enabled : false
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
        }
        return basicBarConfig;
    }

    var baseColors = ['#DFB112', '#ED3C0C', '#9C4618', '#FB9299', '#F22B4E',
    '#5608BA', '#0E61BE', '#2FA383', '#F30881', '#33144D', '#C7D505', '#E136D9',
    '#A413A8', '#8FB12D', '#27E7D3', '#81E585', '#5D94D7', '#4D7366', '#E034CB',
    '#27E7BD', '#CF09E5', '#5D4F6B', '#CDE2A2', '#E55125', '#044E85', '#AF981D',
    '#D12803', '#E0448E', '#5B3C58', '#FFE013', '#95D7A7', '#B0EEBB', '#29D537',
    '#86E27C', '#9BB9A9', '#F9582B', '#4A5845', '#E30E3D', '#DA3628', '#A33023',
    '#AB6871', '#82E9E5', '#BC15DB', '#0E7F7B', '#10BF1F', '#379AEB', '#92E6F3',
    '#44A765', '#1B2119', '#BCBF27', '#E380B5', '#A99421', '#E8631F', '#5564E5',
    '#FD759F', '#995464', '#9DD9A6', '#9E09A8', '#3CF83D', '#8BC376', '#CA3E71',
    '#4286EC', '#E6F89A', '#AF0E68', '#C31821', '#FB0292', '#AC7809', '#A7A80E',
    '#4CC4F1', '#E273B9', '#0E4EEF', '#BC1A4A', '#2BE6D4', '#BBB3C2', '#8E652F',
    '#C34A0D', '#23F06F', '#CA60AA', '#524CAD', '#D8A03F', '#D3ACA5', '#0EED1D',
    '#93C8AF', '#A785C8', '#99D16C', '#B7F2A5', '#A802F3', '#17D6F8', '#C9B3F6',
    '#A1983B', '#A2BE7A', '#553CE6', '#2FEF9C', '#881EB6', '#D459FC', '#A7383B',
    '#FA7127', '#46EE10', '#DC1461', '#3A99E0']

    var createPieChart = function(chart_title, sub_title, all_series) {
        var basicPieConfig = {
            options: {
                chart: {
                    type: 'pie',
                    plotBackgroundColor: null,
                    plotBorderWidth: null,
                    plotShadow: false,
                },
                plotOptions: {
                    pie: {
                        dataLabels: {
                            enabled: false
                        },
                        showInLegend: false
                    }
                }
            }, 
            credits: {
                enabled : false
            },
            title: {
                text: chart_title
            },

            subtitle: {
                text: sub_title
            },
            loading: false,

            series: [{
                type: 'pie',
                data: all_series,
            }],
        }

        return basicPieConfig;
    }

    var createSeries = function(series_key) {
        var series = [];
        for (var i in $scope.plottable) {
            series.push({
                name: $scope.plottable[i]['sample']['name'],
                data: angular.fromJson($scope.plottable[i][series_key]),
                turboThreshold: 0
            });
        }
        return series;
    }

    var sortLimitArray = function(arr, limit) {
        arr.sort(function(a, b) {
            return b[1] - a[1];
        });

        return arr.slice(0, limit);
    }

    var getUniqueColors = function(arrs) {
        var values = {}
        var next = 0;
        for (var i = 0; i < arrs.length; i++) {
            for (var j = 0; j < arrs[i].length; j++) {
                var key = arrs[i][j][0];
                if (!(key in values)) {
                    values[key] = baseColors[next++];
                }
            }
        }
        return values;
    }

    var formatPieData = function(data, colors) {
        var formatted = [];
        for (var i = 0; i < data.length; i++) {
            formatted.push({
                name: data[i][0],
                y: data[i][1],
                color: colors[data[i][0]]
            });
        }
        return formatted;
    }

    var plots = [
        {
            title : 'V Length',
            xl: 'Nucleotides',
            yl: 'Sequences',
            key : 'v_length_dist',
            variable : 'plotVLength'
        },
        {
            title : 'V Match',
            xl: 'Nucleotides',
            yl: 'Sequences',
            key : 'v_match_dist',
            variable : 'plotVMatch'
        },
        {
            title : 'V Gap Length',
            xl: 'Nucleotides',
            yl: 'Sequences',
            key : 'v_gap_length_dist',
            variable : 'plotVGap'
        },
        {
            title : 'J Length',
            xl: 'Nucleotides',
            yl: 'Sequences',
            key : 'j_length_dist',
            variable : 'plotJLength'
        },
        {
            title : 'J Match',
            xl: 'Nucleotides',
            yl: 'Sequences',
            key : 'j_match_dist',
            variable : 'plotJMatch'
        },
        {
            title : 'J Gap Length',
            xl: 'Nucleotides',
            yl: 'Sequences',
            key : 'j_gap_length_dist',
            variable : 'plotJGap'
        },

    ];

    var init = function() {
        $('#loading').modal('show');

        $http({
            method: 'GET',
            url: apiUrl + 'stats',
            params: { "q": {
                "filters" : [
                    { "name" : "sample_id", "op" : "in", "val" :
                        $routeParams['sampleIds'].split(',')
                    }]}}
        }).success(function(data, status) {

            // Column Charts
            $scope.stats = data['objects'];
            $scope.plottable = angular.fromJson($scope.stats)
            for (var i=0; i < plots.length; i++) {
                var p = plots[i];
                $scope[p.variable] = createColumnChart(p.title, p.xl, p.yl, createSeries(p.key));
            }
            
            // Pie Charts
            var data = [];
            $scope.vcalls = [];
            for (var i=0; i<$scope.stats.length; i++) {
                data.push(sortLimitArray(angular.fromJson(
                        $scope.plottable[i]['v_call_dist']), 10));
            }

            var pieColors = getUniqueColors(data);
            for (var i=0; i<$scope.stats.length; i++) {
                $scope.vcalls.push(createPieChart('V Call',
                    $scope.plottable[i]['sample']['name'],
                        formatPieData(data[i], pieColors)));
            }
            //

            $scope.loaded = true;
            $('#loading').modal('hide');
        }).error(function(data, status) {
            $('#loading').modal('hide');
        });
    }

    init();
  }]);
