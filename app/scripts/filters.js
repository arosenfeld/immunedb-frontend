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
        .filter('aminoAcid', function($sce) {
            return function(aa) {
                var lookup = {
                    'R': '#e60606', 'K': '#c64200', 'Q': '#ff6600',
                    'N': '#ff9900', 'E': '#ffcc00', 'D': '#ffcc99',
                    'H': '#e6a847', 'P': '#ffff00', 'Y': '#398439',
                    'W': '#cc99ff', 'S': '#7dd624', 'T': '#00ff99',
                    'G': '#00ff00', 'A': '#69b3dd', 'M': '#99ccff',
                    'C': '#00ffff', 'F': '#00ccff', 'L': '#3366ff',
                    'V': '#0000ff', 'I': '#000080'
                }
                var fstring = '';
                angular.forEach(aa, function(c, i) {
                    fstring += '<span style="color: ' + lookup[c.toUpperCase()]
                        + '">' + c + '</span>';
                });

                return $sce.trustAsHtml(fstring);
            }
        });
})();
