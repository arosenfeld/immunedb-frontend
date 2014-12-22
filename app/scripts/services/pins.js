(function() {
    'use strict';

    angular.module('ImmunologyApp').service('PinService', ['$log',
            '$cookies', '$cookieStore', '$location', 'APIService',
        function($log, $cookies, $cookieStore, $location, APIService) {
            var PREFIX = 'pins_' + APIService.getName() + '_';
            this.addPin = function(data) {
                $cookieStore.put(PREFIX + $location.path(), data);
            }

            this.deletePin = function(loc) {
                $cookieStore.remove(PREFIX + loc);
            }

            this.getPins = function() {
                var pins = {};
                angular.forEach($cookies, function (v, k) {
                    if (k.indexOf(PREFIX) == 0) {
                        pins[k.substring(PREFIX.length)] = angular.fromJson(v);
                    }
                });
                return pins;
            }

            this.clear = function() {
                angular.forEach($cookies, function (v, k) {
                    if (k.indexOf(PREFIX) == 0) {
                        $cookieStore.remove(k);
                    }
                });
            }
        }]);
})();
