(function() {
    'use strict';

    angular.module('ImmunologyApp')
        .factory('clonePager', ['$http', '$q', '$log', 'apiUrl',
            function($http, $q, $log, apiUrl) {

            var getClones = function(samples, filter, page) {
                var def = $q.defer();
                $http({
                    url: apiUrl + 'clone_freqs',
                    params: {
                        'q': {
                            'filters': [{
                                'name': 'sample_id',
                                'op': 'in',
                                'val': samples
                            }, {
                                'name': 'filter_type',
                                'op': 'eq',
                                'val': filter
                            }],
                            'order_by': [{
                                'field': 'copy_number',
                                'direction': 'desc',
                            }],
                        },
                        'results_per_page': 10,
                        'page': page
                    }
                }).success(function(data, status) {
                    var clones = data['objects'];
                    def.resolve(data['objects']);
                }).error(function(data, status) {
                    def.reject();
                });

                return def.promise;
            }

            return { getClones: getClones };
        }]);
})();
