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

                $scope.apiUrl = APIService.getUrl();
                $scope.page = 1;
                $scope.checked_clones = [];

                var getRequest = function() {
                    if (typeof $scope.subject == 'undefined') {
                        return clonePagerService.getClonesBySample(
                            $scope.samples, $scope.filter, $scope.page);
                    }
                    return clonePagerService.getClonesBySubject(
                            $scope.subject, $scope.filter, $scope.page);
                }

                var updateClone = function() {
                    $scope.pageable = false;
                    var call = getRequest($scope.filter, $scope.page);
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

                $scope.prevPage = function() {
                    $scope.page = Math.max(1, $scope.page - 1);
                    updateClone($scope.filter, $scope.page);
                }

                $scope.nextPage = function() {
                    updateClone($scope.filter, ++$scope.page);
                }

                var init = function() {
                    $scope.summationWarning = $scope.samples && $scope.samples.length > 1;
                    $(function() {
                        $('[data-toggle="tooltip"]').tooltip({
                            'placement': 'top'
                        });
                    });
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
