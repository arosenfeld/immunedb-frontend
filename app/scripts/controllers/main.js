(function() {
    'use strict';

    angular.module('ImmunologyApp').controller('MainCtrl', ['$scope', '$log',
            '$routeParams', '$location', 'apis', 'APIService',
        function($scope, $log, $routeParams, $location, apis, APIService) {
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
                return $location.path().split('/')[2];
            }

            var menuClass = function(page) {
                return page === activeMap[getPage()] ? 'active' : '';
            }

            var apiChange = function(key) {
                APIService.setName(key);
                $scope.apiName = APIService.getReadable();
            }

            var showLoader = function() {
                $scope.$parent.modal_head = 'Querying';
                $scope.$parent.modal_text =
                    '<i class="fa fa-spinner fa-spin"></i> Loading data from database...';
                $('#modal').modal('show');
            }

            var hideLoader = function() {
                $('#modal').modal('hide');
            }

            var showError = function() {
                $scope.$parent.modal_head = 'Error';
                $scope.$parent.modal_text = 'There has been an error' +
                ' communicating with the database.';
            }

            var init = function() {
                $scope.apis = apis;
                $scope.api_path = APIService.getName();
                $scope.page = getPage();
                $scope.menuClass = menuClass;
                $scope.apiChange = apiChange;
                $scope.apiName = APIService.getReadable();

                $scope.showLoader = showLoader;
                $scope.hideLoader = hideLoader;
                $scope.showError = showError;
            }

            init();
        }
    ]);
})();
