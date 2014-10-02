(function() {
    'use strict';

    angular.module('ImmunologyApp')
        .controller('MainCtrl', ['$scope', '$log', '$location',
            function($scope, $log, $location) {
                var activeMap = {
                    'studies': 'studies',
                    'samples': 'studies',
                    'clones': 'clones'
                };
                var menuClass = function(page) {
                    var current = $location.path().split('/')[1];
                    return page === activeMap[current] ? 'active' : '';
                };

                var init = function() {
                    $scope.menuClass = menuClass;
                }

                init();
            }
        ]);
})();
