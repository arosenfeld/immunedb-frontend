(function() {
    'use strict';

    angular.module('ImmunologyApp')
        .factory('clonePager', ['$http', '$q', '$log', 'apiUrl',
            function($http, $q, $log, apiUrl) {

            var getClones = function(samples, filter, page) {
                var def = $q.defer();
                $http({
                    url: apiUrl + 'clone_overlap/' + filter + '/' + samples,
                    params: {
                        'page': page
                    }
                }).success(function(data, status) {
                    def.resolve(data['items']);
                }).error(function(data, status) {
                    def.reject();
                });

                return def.promise;
            }

            return { getClones: getClones };
    }]);
})();
