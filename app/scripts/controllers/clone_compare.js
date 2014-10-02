(function() {
    'use strict';
    angular.module('ImmunologyApp')
        .controller('ClonesCompareCtrl', ['$scope', '$http', '$routeParams', '$log', 'apiUrl',
            function($scope, $http, $routeParams, $log, apiUrl) {
                var init = function() {
                    $scope.$parent.modal_head = 'Querying';
                    $scope.$parent.modal_text =
                        'Loading data from database...';
                    $('#modal').modal('show');

                    $http({
                        method: 'GET',
                        url: apiUrl + 'clone_compare/' + $routeParams['uids']
                    }).success(function(data, status) {
                        $scope.cloneInfo = data['objects'];
                        $('#modal').modal('hide');
                    }).error(function(data, status, headers, config) {
                        $scope.$parent.modal_head = 'Error';
                        $scope.$parent.modal_text =
                            'There has been an error communicating with the database. If this occurs again, please contact <a href="mailto:ar374@drexel.edui?subject=SimLab DB Error">ar374@drexel.edu</a>.';
                    });
                }

                init();
            }
        ]);
})();
