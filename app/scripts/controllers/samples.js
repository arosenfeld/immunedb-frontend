'use strict';

angular.module('ImmunologyApp')
  .controller('SampleCtrl', [ '$scope', '$http', '$routeParams', 'apiUrl', function ($scope,
      $http, $routeParams, apiUrl) {

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
            $scope.stats = data['objects'];
            $scope.route = $routeParams;
            $('#loading').modal('hide');
        }).error(function(data, status) {
            $('#loading').modal('hide');
        });
    };

    init();
  }]);
