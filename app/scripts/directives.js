angular.module('ImmunologyDirectives', [])
    .directive('clonePager', function() {
        return {
            restrict: 'E',
            scope: {
                clones: '='
            },
            templateUrl: 'partials/clone_pager.html'
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
                clones: '=?'
            },
            templateUrl: 'partials/filtered_panel.html',
            compile: function(element, attrs) {
                if (!attrs.tclass) {
                    attrs.tclass = 'tab-pane';
                }
            }
        };
    });
