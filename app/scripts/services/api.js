(function() {
    'use strict';

    angular.module('ImmunologyApp').service('APIService', ['$cookieStore', '$log',
            '$route', 'apis',
        function($cookieStore, $log, $route, apis) {
            this.getName = function() {
                if(typeof $cookieStore.get('apiName') == 'undefined') {
                    this.setName('primary');
                }
                return $cookieStore.get('apiName');
            }

            this.getReadable = function() {
                return apis[this.getName()]['name'];
            }

            this.getUrl = function() {
                return apis[this.getName()]['url'];
            }

            this.setName = function(apiName) {
                $cookieStore.put('apiName', apiName);
                $route.reload();
            }
        }]);
})();
