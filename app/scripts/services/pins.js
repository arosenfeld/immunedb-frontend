(function() {
    'use strict';

    angular.module('ImmunologyApp').service('PinService', ['$log',
            '$cookies', '$cookieStore', '$location',
        function($log, $cookies, $cookieStore, $location) {
            var PREFIX = 'pin_';
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
