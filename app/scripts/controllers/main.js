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

            var getPage = function() {
                return $location.path().split('/')[1];
            }

            var menuClass = function(page) {
                return page === activeMap[getPage()] ? 'active' : '';
            };

            var apiChange = function(name) {
                APIService.setName(name);
                $scope.db_version = APIService.getReadable();
            }

            var allowApiChange = function() {
                return ['studies', 'clones', 'subjects'].indexOf(getPage()) >= 0;
            }

            var init = function() {
                $scope.apis = apis;
                $scope.db_version = APIService.getReadable();
                $scope.page = getPage();
                $scope.menuClass = menuClass;
                $scope.apiChange = apiChange;
                $scope.allowApiChange = allowApiChange;
            }

            init();
        }
    ]);
})();
