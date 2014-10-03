(function() {
    'use strict';

    // TODO: Move/rename this
    var lookup = {
        'R': '#e60606', 'K': '#c64200', 'Q': '#ff6600',
        'N': '#ff9900', 'E': '#ffcc00', 'D': '#ffcc99',
        'H': '#e6a847', 'P': '#ffff00', 'Y': '#398439',
        'W': '#cc99ff', 'S': '#7dd624', 'T': '#00ff99',
        'G': '#00ff00', 'A': '#69b3dd', 'M': '#99ccff',
        'C': '#00ffff', 'F': '#00ccff', 'L': '#3366ff',
        'V': '#0000ff', 'I': '#000080'
    }

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
                if (typeof aa == 'undefined') {
                    return '';
                }
                var fstring = '';
                angular.forEach(aa, function(c, i) {
                    fstring += '<span style="color: ' + lookup[c.toUpperCase()]
                        + '">' + c + '</span>';
                });

                return $sce.trustAsHtml(fstring);
            }
        })
        .filter('seqComp', function($sce) {
            return function(s) {
                var lookup = {
                    '!': '#ff0000', '?': '#0000ff', '*': '#00ff00',
                }
                var fstring = '';
                angular.forEach(s, function(c, i) {
                    fstring += '<span style="color: ' + lookup[c.toUpperCase()]
                        + '">' + c + '</span>';
                });

                return $sce.trustAsHtml(fstring);
            }
        })
        .filter('colorSeqAsAA', function($sce) {
            return function(s) {
                if (typeof s == 'undefined') {
                    return '';
                }
                var aa_lookup = { 'TTT': 'F', 'TTC': 'F', 'TTA': 'L', 'TTG': 'L',
                'TCT': 'S', 'TCC': 'S', 'TCA': 'S', 'TCG': 'S', 'TAT': 'Y', 'TAC':
                'Y', 'TAA': 'X', 'TAG': 'X', 'TGT': 'C', 'TGC': 'C', 'TGA': 'X',
                'TGG': 'W', 'CTT': 'L', 'CTC': 'L', 'CTA': 'L', 'CTG': 'L', 'CCT':
                'P', 'CCC': 'P', 'CCA': 'P', 'CCG': 'P', 'CAT': 'H', 'CAC': 'H',
                'CAA': 'Q', 'CAG': 'Q', 'CGT': 'R', 'CGC': 'R', 'CGA': 'R', 'CGG':
                'R', 'ATT': 'I', 'ATC': 'I', 'ATA': 'I', 'ATG': 'M', 'ACT': 'T',
                'ACC': 'T', 'ACA': 'T', 'ACG': 'T', 'AAT': 'N', 'AAC': 'N', 'AAA':
                'K', 'AAG': 'K', 'AGT': 'S', 'AGC': 'S', 'AGA': 'R', 'AGG': 'R',
                'GTT': 'V', 'GTC': 'V', 'GTA': 'V', 'GTG': 'V', 'GCT': 'A', 'GCC':
                'A', 'GCA': 'A', 'GCG': 'A', 'GAT': 'D', 'GAC': 'D', 'GAA': 'E',
                'GAG': 'E', 'GGT': 'G', 'GGC': 'G', 'GGA': 'G', 'GGG': 'G' };
                var ret = '';
                for(var i = 0; i < s.length; i += 3) {
                    var nt = s.substring(i, i + 3);
                    var color = '#000000';
                    if (nt in aa_lookup) {
                        color = lookup[aa_lookup[nt]];
                    }
                    ret += '<span style="color: ' + color + '">' + nt +
                        '</span>';
                }
                return $sce.trustAsHtml(ret);
            }
        });
})();
