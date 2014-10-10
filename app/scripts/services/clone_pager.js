(function() {
    'use strict';

    angular.module('ImmunologyApp').service('clonePager', ['$http', '$q',
            '$log', 'apiUrl',
        function($http, $q, $log, apiUrl) {
            this.getClones = function(samples, filter, page) {
                var def = $q.defer();
                $http({
                    url: apiUrl + 'clone_overlap/' + filter + '/' + samples,
                    params: {
                        'page': page
                    }
                }).success(function(data, status) {
                    var clones = data['items'];
                    angular.forEach(clones, function(clone, i) {
                        clone.compareStr = '';
                        angular.forEach(clone.samples.split(','), function(sample, j) {
                            clone.compareStr += ',' + clone.clone.id + '_' +
                                sample;
                        });
                        clone.compareStr = clone.compareStr.substring(1);
                    });
                    def.resolve(clones);
                }).error(function(data, status) {
                    def.reject();
                });

                return def.promise;
            }
        }]);
})();
