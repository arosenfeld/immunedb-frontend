(function() {
    'use strict';

    angular.module('ImmunologyApp').controller('MainCtrl', ['$scope', '$log',
            '$rootScope', '$route', '$routeParams', '$location', 'apis',
            'APIService', 'PinService',
        function($scope, $log, $rootScope, $route, $routeParams, $location,
                apis, APIService, PinService) {
            var activeMap = {
                'studies': 'studies',
                'samples': 'studies',
                'clones': 'clones',
                'clone': 'clones',
                'sequence': 'sequences',
                'sequences': 'sequences',
                'subjects': 'subjects',
                'subject': 'subjects',
                'pins': 'pins',
                'modification_log': 'modification_log'
            };

            var getPage = function() {
                return $location.path().split('/')[2];
            }

            var menuClass = function(page) {
                return page === activeMap[getPage()] ? 'active' : '';
            }

            $scope.apiChange = function(key) {
                APIService.setName(key);
                $scope.apiName = APIService.getReadable();
                $scope.apiPath = APIService.getName();
                $scope.apiChanged = true;
            }

            $scope.showLoader = function() {
                $scope.$parent.modal_head = 'Querying';
                $scope.$parent.modal_text =
                    '<i class="fa fa-spinner fa-spin"></i> Loading data from database...';
                $('#modal').modal('show');
            }

            $scope.hideLoader = function() {
                $('#modal').modal('hide');
            }

            $scope.showError = function() {
                $scope.$parent.modal_head = 'Error';
                $scope.$parent.modal_text = 'There has been an error' +
                ' communicating with the database.';
            }

            $scope.showNotify = function(text) {
                $('.top-right').notify({
                    message: { text: text },
                    closable: false,
                    fadeOut: { enabled: true, delay: 1000 }
                }).show();
            }

            var init = function() {
                $scope.apiChanged = false;
                $scope.apis = apis;
                $scope.apiPath = APIService.getName();
                $scope.page = getPage();
                $scope.menuClass = menuClass;
                $scope.apiName = APIService.getReadable();

                $scope.pins = PinService;
            }

            init();
        }
    ]);
})();
