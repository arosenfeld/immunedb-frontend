(function() {
    'use strict';

    angular.module('ImmunologyApp').service('ClonePagerService', ['$http', '$q',
            '$log', 'APIService',
        function($http, $q, $log, APIService) {
            this.getClonesBySubject = function(subject, filter, page) {
                return doRequest(null, subject, filter, page);
            }

            this.getClonesBySample = function(samples, filter, page) {
                return doRequest(samples, null, filter, page);
            }

            var doRequest  = function(samples, subject, filter, page) {
                var url = APIService.getUrl();
                if (samples != null) {
                    url += 'clone_overlap/' + filter + '/' + samples;
                } else {
                    url += 'subject_clones/' + filter + '/' + subject;
                }
                var def = $q.defer();
                $http({
                    url: url,
                    params: {
                        'page': page
                    }
                }).success(function(data, status) {
                    var clones = data['clones'];
                    angular.forEach(clones, function(clone, i) {
                        clone.compareStr = '';
                        angular.forEach(clone.samples, function(sample, j) {
                            clone.compareStr += ',' + clone.clone.id + '_' +
                                sample;
                        });
                        clone.compareStr = clone.compareStr.substring(1);
                    });
                    def.resolve({
                        'clones': clones,
                        'num_pages': data['num_pages']
                    });
                }).error(function(data, status) {
                    def.reject();
                });

                return def.promise;
            }
        }]);
})();
