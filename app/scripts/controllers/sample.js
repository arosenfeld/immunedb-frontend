'use strict';

angular.module('ImmunologyApp')
  .controller('SampleCtrl', [ '$scope', '$http', '$routeParams', 'apiUrl', function ($scope,
  $http, $routeParams, apiUrl) {
    $('#loading').modal('show');
    $http({
        method: 'GET',
        url: apiUrl + 'stats',
        params: angular.toJson({ "q": {
            "filters" : [
                { "name" : "sample_id", "op" : "eq", "val" :
                    $routeParams['sampleId']
                }]}})
    }).success(function(data, status) {
        $scope.stats = data['objects'][0];
        $scope.sample = data['objects'][0]['sample'];
        $scope.route = $routeParams;
        $('#loading').modal('hide');
    }).error(function(data, status) {
        $('#loading').modal('hide');
    });
  }]);
