(function() {
    'use strict';
    angular.module('ImmunologyApp')
        .controller('ClonesCompareCtrl', ['$scope', '$http', '$routeParams',
        '$timeout', '$log', 'apiUrl',
            function($scope, $http, $routeParams, $timeout, $log, apiUrl) {
                var lookup = {
                    'R': '#e60606', 'K': '#c64200', 'Q': '#ff6600',
                    'N': '#ff9900', 'E': '#ffcc00', 'D': '#ffcc99',
                    'H': '#e6a847', 'P': '#ffff00', 'Y': '#398439',
                    'W': '#cc99ff', 'S': '#7dd624', 'T': '#00ff99',
                    'G': '#00ff00', 'A': '#69b3dd', 'M': '#99ccff',
                    'C': '#00ffff', 'F': '#00ccff', 'L': '#3366ff',
                    'V': '#0000ff', 'I': '#000080'
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


                var drawCompare = function(cloneId) {
                    var TOP_PAD = 10;
                    var LEFT_PAD = 5;
                    var CHAR_SPACE = 8;
                    var V_PER_SEQ = 20;
                    var V_SPACE = 20;

                    var canvas = $('#compare_' + cloneId).get(0);
                    var ctx = canvas.getContext('2d');
                    var info = $scope.cloneInfo[cloneId];

                    var labelMaxLength = 0;
                    angular.forEach(info.seqs, function(v, k) {
                        var label = v.sample.id + ': ' + v.seq_id;
                        labelMaxLength = Math.max(label.length,
                            labelMaxLength);
                    });

                    canvas.width = (labelMaxLength +
                        info.clone.germline.length) * (CHAR_SPACE + .01);
                    canvas.height = (info.seqs.length + 2) * V_PER_SEQ;
                    ctx.font = 'bold 10px Courier New';

                    ctx.fillText('Germline', LEFT_PAD, TOP_PAD);
                    angular.forEach(info.clone.germline, function(c, i) {
                        var nt = info.clone.germline.substring(i, i + 3);
                        if (nt in aa_lookup) {
                            ctx.fillStyle = lookup[aa_lookup[nt]];
                        } else {
                            ctx.fillStyle = '#000000';
                        }
                        ctx.fillText(c,
                            LEFT_PAD + (7 * labelMaxLength) + (8 * i),
                            10);
                    });

                    var i = 0;
                    angular.forEach(info.seqs, function(seq, id) {
                        var label = seq.sample.id + ': ' + seq.seq_id;
                        ctx.fillText(label, LEFT_PAD, TOP_PAD + V_SPACE * (1 +
                        i));
                        angular.forEach(seq.sequence, function(c, j) {
                            var nt = seq.sequence.substring(j, j + 3);
                            if (nt in aa_lookup) {
                                ctx.fillStyle = lookup[aa_lookup[nt]];
                            } else {
                                ctx.fillStyle = '#000000';
                            }
                            ctx.fillText(c, 
                                LEFT_PAD + (7 * labelMaxLength) + (8 * j),
                                TOP_PAD + V_SPACE * (i + 1));
                        });
                        i++;
                    });
                }

                var init = function() {
                    $scope.$parent.modal_head = 'Querying';
                    $scope.$parent.modal_text =
                        'Loading data from database...';
                    $('#modal').modal('show');

                    $http({
                        method: 'GET',
                        url: apiUrl + 'clone_compare/' + $routeParams['uids']
                    }).success(function(data, status) {
                        $scope.cloneInfo = data['objects'];
                        $timeout(function() {
                            for (var cloneId in $scope.cloneInfo) {
                                drawCompare(cloneId);
                            }
                        }, 0);
                        $('#modal').modal('hide');
                    }).error(function(data, status, headers, config) {
                        $scope.$parent.modal_head = 'Error';
                        $scope.$parent.modal_text =
                            'There has been an error communicating with the database. If this occurs again, please contact <a href="mailto:ar374@drexel.edui?subject=SimLab DB Error">ar374@drexel.edu</a>.';
                    });
                }

                init();
            }
        ]);
})();
