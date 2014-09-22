'use strict';

angular.module('ImmunologyApp')
  .controller('SampleCtrl', [ '$scope', '$http', '$routeParams', '$log', 'apiUrl', function ($scope,
      $http, $routeParams, $log, apiUrl) {

    var createColumnChart = function(chart_title, key, x_label, y_label,
        all_series) {
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
            key: key
        }
        return basicBarConfig;
    }

    var createSeries = function(series_key, type) {
        var series = [];
        for (var i in $scope.plottable) {
            series.push({
                name: $scope.plottable[i]['sample']['name'],
                data:
                    angular.fromJson($scope.plottable[i][type][series_key]),
                turboThreshold: 0
            });
        }
        return series;
    }

    var plots = [
        {
            title: 'CDR3 Length',
            xl: 'Nucleotides',
            yl: 'Sequences',
            key: 'cdr3_len_dist',
        },
        {
            title: 'V Gene Length',
            xl: 'Nucleotides',
            yl: 'Sequences',
            key: 'v_length_dist',
        },
        {
            title : 'V Nucleotides Matching Germline',
            xl: 'Nucleotides',
            yl: 'Sequences',
            key : 'v_match_dist',
        },
        {
            title : 'J Gene Length',
            xl: 'Nucleotides',
            yl: 'Sequences',
            key : 'j_length_dist',
        },
        {
            title : 'J Nucleotides Matching Germline',
            xl: 'Nucleotides',
            yl: 'Sequences',
            key : 'j_match_dist',
        },
    ];

    var filters = [ 'all', 'functional', 'nonfunctional' ];

    var init = function() {
        $('#loading').modal('show');

        $('#funcTab a').click(function(e) {
            if($(this).parent('li').hasClass('active')) {
                $( $(this).attr('href') ).hide();
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
        });

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
            $scope.grouped_stats = {}
            for (var e in $scope.stats) {
                var data = $scope.stats[e];
                if (!(data.sample_id in $scope.grouped_stats)) {
                    $scope.grouped_stats[data.sample_id] = {
                        'sample' : data.sample
                    }
                }
                $scope.grouped_stats[data.sample_id][data.filter_type] = data;
            }

            $scope.plottable = angular.fromJson($scope.grouped_stats);
            $scope.charts = {};
            for (var i = 0; i < plots.length; i++) {
                var p = plots[i];
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
            $scope.loaded = true;
            $('#loading').modal('hide');
        }).error(function(data, status) {
            $('#loading').modal('hide');
        });
    }

    init();
  }]);
