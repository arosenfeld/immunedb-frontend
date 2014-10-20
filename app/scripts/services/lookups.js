(function() {
    'use strict';

    angular.module('ImmunologyApp') .factory('lookups', [function() {
        var aaToColor = {
            'R': '#e60606', 'K': '#c64200', 'Q': '#ff6600', 'N':
            '#ff9900', 'E': '#ffcc00', 'D': '#ffcc99', 'H': '#e6a847', 'P':
            '#a4993d', 'Y': '#398439', 'W': '#cc99ff', 'S': '#7dd624', 'T':
            '#00ff99', 'G': '#00ff00', 'A': '#69b3dd', 'M': '#99ccff', 'C':
            '#00ffff', 'F': '#00ccff', 'L': '#3366ff', 'V': '#0000ff', 'I':
            '#000080'
        }

        var dnaToColor = {
            'A': '#ff0000',
            'T': '#0000ff',
            'C': '#00ff00',
            'G': '#ff8c00'
        }

        var ntToAA = {
            'TTT': 'F', 'TTC': 'F', 'TTA': 'L', 'TTG': 'L', 'TCT': 'S', 'TCC':
            'S', 'TCA': 'S', 'TCG': 'S', 'TAT': 'Y', 'TAC': 'Y', 'TAA': 'X',
            'TAG': 'X', 'TGT': 'C', 'TGC': 'C', 'TGA': 'X', 'TGG': 'W', 'CTT':
            'L', 'CTC': 'L', 'CTA': 'L', 'CTG': 'L', 'CCT': 'P', 'CCC': 'P',
            'CCA': 'P', 'CCG': 'P', 'CAT': 'H', 'CAC': 'H', 'CAA': 'Q', 'CAG':
            'Q', 'CGT': 'R', 'CGC': 'R', 'CGA': 'R', 'CGG': 'R', 'ATT': 'I',
            'ATC': 'I', 'ATA': 'I', 'ATG': 'M', 'ACT': 'T', 'ACC': 'T', 'ACA':
            'T', 'ACG': 'T', 'AAT': 'N', 'AAC': 'N', 'AAA': 'K', 'AAG': 'K',
            'AGT': 'S', 'AGC': 'S', 'AGA': 'R', 'AGG': 'R', 'GTT': 'V', 'GTC':
            'V', 'GTA': 'V', 'GTG': 'V', 'GCT': 'A', 'GCC': 'A', 'GCA': 'A',
            'GCG': 'A', 'GAT': 'D', 'GAC': 'D', 'GAA': 'E', 'GAG': 'E', 'GGT':
            'G', 'GGC': 'G', 'GGA': 'G', 'GGG': 'G'
        }

        var dnaColor = function(nt) {
            if (nt in dnaToColor) {
                return dnaToColor[nt];
            }
            return null;
        }

        var aaColor = function(aa) {
            if (aa in aaToColor) {
                return aaToColor[aa];
            }
            return null;
        }

        var aaLookup = function(nt) {
            if (nt in ntToAA) {
                return ntToAA[nt];
            }
            return null;
        }

        return { aaColor: aaColor, aaLookup: aaLookup };
    }]);
})();
