(function() {
    'use strict';

    angular.module('ImmunologyDirectives', []) .directive('clonePager', [
            '$location', '$log', 'apiUrl', function($location, $log, apiUrl) {
        return {
            restrict: 'E',
            scope: {
                filter: '=',
                clones: '=',
                samples: '=',
                pager: '='
            },
            templateUrl: 'partials/clone_pager.html',
            controller: function($scope) {
                $scope.apiUrl = apiUrl;
                $scope.page = 1;
                $scope.checked_clones = [];
                
                $scope.prevPage = function() {
                    $scope.page = Math.max(1, $scope.page - 1);
                    $scope.pager($scope.filter, $scope.page);
                }

                $scope.nextPage = function() {
                    $scope.pager($scope.filter, ++$scope.page);
                }

                $scope.viewClones = function() {
                    $location.path('/clone_compare/' +
                        $scope.checked_clones.join());
                }
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
                pager: '='
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
