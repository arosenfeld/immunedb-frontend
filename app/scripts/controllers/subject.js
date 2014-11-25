(function() {
    'use strict';

    angular.module('ImmunologyApp') .controller('SubjectCtrl', ['$scope',
            '$http', '$q', '$routeParams', '$log', 'APIService',
        function($scope, $http, $q, $routeParams, $log, APIService) {
            var getSubject = function(sid) {
                var def = $q.defer();
                $http({
                    method: 'GET',
                    url: APIService.getUrl() + 'subject/' + sid,
                }).success(function(data, status) {
                    def.resolve(data['subject']);
                }).error(function(data, status, headers, config) {
                    def.reject();
                });

                return def.promise;
            }

            var init = function() {
                $scope.showLoader();
                $scope.$parent.page_title = 'Subject';
                $scope.subject_id = $routeParams['subjectId'];

                getSubject($routeParams['subjectId']).then(
                    function(result) {
                        $scope.subject = result;
                        $scope.sample_ids = result.samples.map(function(e) {
                            return String(e.id);
                        });
                        $scope.hideLoader();
                    },
                    function(result) {
                        $scope.showError();
                    }
                );
            }

            init();
        }
    ]);
})();
