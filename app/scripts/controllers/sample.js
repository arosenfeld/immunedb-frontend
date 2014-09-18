'use strict';

angular.module('ImmunologyApp')
  .controller('StudiesCtrl', [ '$scope', '$http', 'apiUrl', function ($scope,
  $http, apiUrl) {
    $('#loading').modal('show');
    $http({
        method: 'GET',
        url: apiUrl + 'studies'
    }).success(function(data, status) {
        $scope.rows = data['objects'];
        $('#loading').modal('hide');
    }).error(function(data, status) {
        $('#loading').modal('hide');
    });
  }]);
