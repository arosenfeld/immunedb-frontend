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
                $scope.$parent.modal_head = 'Querying';
                $scope.$parent.modal_text =
                    'Loading data from database...';
                $('#modal').modal('show');
                $scope.$parent.page_title = 'Subject';
                $scope.subject_id = $routeParams['subjectId'];

                getSubject($routeParams['subjectId']).then(
                    function(result) {
                        $scope.subject = result;
                        $('#modal').modal('hide');
                    },
                    function(result) {
                        $scope.$parent.modal_head = 'Error';
                        $scope.$parent.modal_text =
                            'There has been an error communicating with the database. If this occurs again, please contact <a href="mailto:ar374@drexel.edui?subject=SimLab DB Error">ar374@drexel.edu</a>.';
                    }
                );
            }

            init();
        }
    ]);
})();
