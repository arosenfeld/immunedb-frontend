(function() {
    'use strict';

    angular.module('ImmunologyFilters', ['ngSanitize'])
        .filter('formatNumber', function() {
            return function(number) {
                if (number >= Math.pow(10, 12)) {
                    number = (number / Math.pow(10, 12)).toFixed(1) + "t";
                } else if (number < Math.pow(10, 12) && number >= Math.pow(10,
                    9)) {
                    number = (number / Math.pow(10, 9)).toFixed(1) + "b";
                } else if (number < Math.pow(10, 9) && number >= Math.pow(10, 6)) {
                    number = (number / Math.pow(10, 6)).toFixed(1) + "m";
                } else if (number < Math.pow(10, 6) && number >= Math.pow(10, 3)) {
                    number = (number / Math.pow(10, 3)).toFixed(1) + "k";
                }

                return number;
            }
        })
        .filter('aminoAcid', ['$sce', 'lookups', function($sce, lookups) {
            return function(aa) {
                if (typeof aa == 'undefined') {
                    return '';
                }
                var fstring = '';
                angular.forEach(aa, function(c, i) {
                    var color = lookups.aaColor(c.toUpperCase()) || '#000000';
                    fstring += '<span style="color: ' + color 
                        + '">' + c + '</span>';
                });

                return $sce.trustAsHtml(fstring);
            }
        }])
        .filter('dna', ['$sce', 'lookups', function($sce, lookups) {
            return function(nt) {
                if (typeof nt == 'undefined') {
                    return '';
                }
                var fstring = '';
                angular.forEach(nt, function(c, i) {
                    var color = lookups.dnaColor(c.toUpperCase()) || '#000000';
                    fstring += '<span style="color: ' + color
                        + '">' + c + '</span>';
                });

                return $sce.trustAsHtml(fstring);
            }
        }])
        .filter('capitalize', function() {
            return function(input, all) {
                return (!!input) ? input.replace(/([^\W_]+[^\s-]*) */g,
                    function(txt){return txt.charAt(0).toUpperCase() +
                    txt.substr(1).toLowerCase();}) : '';
            }
        });
})();
