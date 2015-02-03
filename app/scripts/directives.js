(function() {
    'use strict';

    angular.module('ImmunologyDirectives', [])
    .directive('clonePager', [
            '$location', '$log', 'ClonePagerService', 'APIService',
            function($location, $log, clonePagerService, APIService) {
        return {
            restrict: 'E',
            scope: {
                apiPath: '=',
                filter: '=',
                samples: '=?',
                subject: '=?',
            },
            templateUrl: 'partials/clone_pager.html',
            controller: function($scope) {
                var updateClone = function(filter, page) {
                    $scope.pageable = false;
                    if (typeof $scope.subject == 'undefined') {
                        var call = clonePagerService.getClonesBySample(
                            $scope.samples, filter, page);
                    } else {
                        var call = clonePagerService.getClonesBySubject(
                            $scope.subject, filter, page);
                    }

                    call.then(
                        function(result) {
                            $scope.clones = result['clones']
                            $scope.total_pages = result['num_pages'] 
                            $scope.pageable = true;
                        },
                        function(result) {
                        }
                    );
                }

                $scope.apiUrl = APIService.getUrl();
                $scope.page = 1;
                $scope.checked_clones = [];
                
                $scope.prevPage = function() {
                    $scope.page = Math.max(1, $scope.page - 1);
                    updateClone($scope.filter, $scope.page);
                }

                $scope.nextPage = function() {
                    updateClone($scope.filter, ++$scope.page);
                }

                var init = function() {
                    updateClone($scope.filter, 1);
                    $scope.pageable = false;
                }
                init();
            }
        }
    }])
    .directive('filteredPanel', ['$log', function($log) {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                apiPath: '=',
                tclass: '@',
                cnt: '=',
                filter: '@',
                heatmap: '@',
                charts: '=',
                clones: '=?',
                samples: '=',
            },
            templateUrl: 'partials/filtered_panel.html',
            controller: function($scope) {
            },
            compile: function(element, attrs) {
                if (!attrs.tclass) {
                    attrs.tclass = 'tab-pane';
                }
            }
        }
    }])
})();
