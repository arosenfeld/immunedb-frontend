(function() {
    'use strict';

    angular.module('ImmunologyDirectives', []) .directive('clonePager', [
            '$location', '$log', 'ClonePagerService', 'apiUrl',
            function($location, $log, clonePagerService, apiUrl) {
        return {
            restrict: 'E',
            scope: {
                filter: '=',
                samples: '=',
            },
            templateUrl: 'partials/clone_pager.html',
            controller: function($scope) {

                var updateClone = function(filter, page) {
                    clonePagerService.getClones($scope.samples,
                        filter, page)
                        .then(
                            function(result) {
                                $scope.clones = result;
                            },
                            function(result) {
                            }
                        );
                }

                $scope.apiUrl = apiUrl;
                $scope.page = 1;
                $scope.checked_clones = [];
                
                $scope.prevPage = function() {
                    $scope.page = Math.max(1, $scope.page - 1);
                    updateClone($scope.filter, $scope.page);
                }

                $scope.nextPage = function() {
                    updateClone($scope.filter, ++$scope.page);
                }

                $scope.viewClones = function() {
                    $location.path('/clone_compare/' +
                        $scope.checked_clones.join());
                }

                var init = function() {
                    updateClone($scope.filter, 1);
                }
                init();
            }
        }
    }])
    .directive('filteredPanel', function() {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                tclass: '@',
                filter: '@',
                heatmap: '@',
                charts: '=',
                clones: '=?',
                samples: '=',
            },
            templateUrl: 'partials/filtered_panel.html',
            compile: function(element, attrs) {
                if (!attrs.tclass) {
                    attrs.tclass = 'tab-pane';
                }
            }
        }
    });
})();
