(function() {
    'use strict';

    angular.module('ImmunologyApp').controller('MainCtrl', ['$scope', '$log',
            '$location', 'apis', 'APIService',
        function($scope, $log, $location, apis, APIService) {
            var activeMap = {
                'studies': 'studies',
                'samples': 'studies',
                'clones': 'clones',
                'clone_compare': 'clones',
                'sequence': 'studies',
                'subjects': 'subjects',
                'subject': 'subjects',
            };

            var menuClass = function(page) {
                var current = $location.path().split('/')[1];
                return page === activeMap[current] ? 'active' : '';
            };

            var apiChange = function(name) {
                APIService.setName(name);
                $scope.db_version = APIService.getReadable();
            }

            var init = function() {
                $scope.apis = apis;
                $scope.db_version = APIService.getReadable();
                $scope.menuClass = menuClass;
                $scope.apiChange = apiChange;
            }

            init();
        }
    ]);
})();
