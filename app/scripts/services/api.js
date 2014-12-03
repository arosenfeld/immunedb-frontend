(function() {
    'use strict';

    angular.module('ImmunologyApp').service('APIService', ['$location', '$log',
            'apis',
        function($location, $log, apis) {
            this.getName = function() {
                var loc = $location.path().split('/')[1];
                if (typeof loc == 'undefined') {
                    return 'primary';
                }
                return loc;
            }

            this.getReadable = function() {
                return apis[this.getName()]['name'];
            }

            this.getUrl = function() {
                return apis[this.getName()]['url'];
            }

            this.setName = function(apiName) {
                var path = apiName + '/'
                path += $location.path().split('/').slice(2).join('/');
                $location.path(path);
            }
        }]);
})();
