(function() {
    'use strict';
    angular.module('ImmunologyApp')
        .controller('ClonesCtrl', ['$scope', '$http', '$q', '$location', '$log',
            'apiUrl',
            function($scope, $http, $q, $location, $log, apiUrl) {

                $scope.prevPage = function() {
                    $scope.page = Math.max(1, $scope.page - 1);
                    getClones($scope.page).then(function(result) {
                        $log.debug(result);
                        $scope.clones = result;
                    });
                }

                $scope.nextPage = function() {
                    getClones(++$scope.page).then(function(result) {
                        $scope.clones = result;
                    });
                }

                $scope.checked_samples = [];

                $scope.viewSamples = function() {
                    $location.path('/clone_compare/' + $scope.checked_samples.join());
                };

                var getClones = function(page) {
                    var def = $q.defer();
                    $http({
                        method: 'GET',
                        url: apiUrl + 'clones',
                        params: {
                            'page': page,
                            'per_page': 25
                        }
                    }).success(function(data, status) {
                        var objs = data['objects'];
                        def.resolve(objs);
                    }).error(function(data, status, headers, config) {
                        def.reject();
                    });

                    return def.promise;
                }

                var init = function() {
                    $scope.$parent.modal_head = 'Querying';
                    $scope.$parent.modal_text =
                        'Loading data from database...';
                    $('#modal').modal('show');

                    $scope.page = 1;
                    getClones($scope.page).then(
                        function(result) {
                            $scope.clones = result;
                            $('#modal').modal('hide');
                        },
                        function(result) {
                            $scope.$parent.modal_head = 'Error';
                            $scope.$parent.modal_text =
                                'There has been an error communicating with the database. If this occurs again, please contact <a href="mailto:ar374@drexel.edui?subject=SimLab DB Error">ar374@drexel.edu</a>.';
                        }
                    );
                }

                init();
            }
        ]);
})();
