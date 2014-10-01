(function() {
    'use strict';

    angular.module('ImmunologyDirectives', [])
        .directive('clonePager', function() {
            return {
                restrict: 'E',
                scope: {
                    filter: '=',
                    clones: '=',
                    pager: '='
                },
                templateUrl: 'partials/clone_pager.html',
                controller: function($scope) {
                    $scope.page = 1;
                    $scope.prevPage = function() {
                        $scope.page = Math.max(1, $scope.page - 1);
                        $scope.pager($scope.filter, $scope.page);
                    }
                    $scope.nextPage = function() {
                        $scope.pager($scope.filter, ++$scope.page);
                    }
                }
            }
        })
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
                    pager: '='
                },
                templateUrl: 'partials/filtered_panel.html',
                compile: function(element, attrs) {
                    if (!attrs.tclass) {
                        attrs.tclass = 'tab-pane';
                    }
                }
            };
        });
})();
