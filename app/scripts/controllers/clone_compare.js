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

                var aaLookup = function(nt) {
                    if (nt in aa_lookup) {
                        return aa_lookup[nt];
                    }
                    return null;
                }

                var drawCompare = function(cloneId) {
                    var TOP_PAD = 30;
                    var LEFT_PAD = 5;
                    var CHAR_SPACE = 20;
                    var V_PER_SEQ = 20;

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
                    canvas.height = (info.seqs.length + 2) * V_PER_SEQ + 35;
                    ctx.font = 'bold 12px Courier New';

                    ctx.fillText('Germline', LEFT_PAD, TOP_PAD);
                    var middlePad = (CHAR_SPACE - 12) * labelMaxLength;
                    angular.forEach(info.clone.germline, function(c, i) {
                        if (i % 3 == 0) {
                            var nt = info.clone.germline.substring(i, i + 3);
                            if (nt in aa_lookup) {
                                ctx.fillStyle = lookup[aaLookup(nt)];
                            } else {
                                ctx.fillStyle = '#000000';
                            }
                        }

                        ctx.fillText(c,
                            LEFT_PAD + middlePad + (CHAR_SPACE * i),
                            TOP_PAD);
                    });

                    var i = 0;
                    var diffs = {}
                    angular.forEach(info.seqs, function(seq, id) {
                        var label = seq.sample.id + ': ' + seq.seq_id;
                        ctx.fillText(label, LEFT_PAD, TOP_PAD + V_PER_SEQ
                            * (1 + i));

                        angular.forEach(seq.sequence, function(c, j) {
                            var left = LEFT_PAD + middlePad + (CHAR_SPACE * j);
                            var top = TOP_PAD + V_PER_SEQ * (i + 1);
                            if (j % 3 == 0) {
                                var nt = seq.sequence.substring(j, j + 3);
                                if (nt in aa_lookup) {
                                    ctx.fillStyle = lookup[aaLookup(nt)];
                                } else {
                                    ctx.fillStyle = '#000000';
                                }
                            }

                            // TODO: Compare with one change, not against
                            // germline
                            if (seq.sequence[j] != info.clone.germline[j]) {
                                var aaStart = j - (j % 3);
                                var gAA = aaLookup(info.clone.germline.substring(aaStart, aaStart
                                    + 3));
                                var sAA = aaLookup(seq.sequence.substring(aaStart, aaStart
                                    + 3));
                                ctx.beginPath();
                                ctx.rect(left - 2.5, top - CHAR_SPACE + 8, 15, 15);
                                ctx.lineWidth = 2;
                                if (!(j in diffs)) {
                                    diffs[j] = { 'silent': 0, 'change': 0,
                                    'unk': 0 }
                                }
                                if (gAA == null || sAA == null) {
                                    ctx.strokeStyle = '#0000ff';
                                    diffs[j]['unk']++;
                                } else if (gAA != sAA) {
                                    ctx.strokeStyle = '#ff0000';
                                    diffs[j]['change']++;
                                } else if (gAA == sAA) {
                                    ctx.strokeStyle = '#00ff00';
                                    diffs[j]['silent']++;
                                }
                                ctx.stroke();
                            }
                            ctx.fillText(c, left, top);
                        });
                        i++;
                    });

                    angular.forEach(diffs, function(vals, offset) {
                        var t = '';
                        if (vals['silent'] >= info.seqs.length / 2.0) {
                            t = 'S';
                            ctx.fillStyle = '#00ff00';
                        } else if (vals['change'] >= info.seqs.length / 2.0) {
                            t += (t.length > 0 ? '\n' : '') + 'N';
                            ctx.fillStyle = '#ff0000';
                        } else if (vals['unk'] >= info.seqs.length / 2.0) {
                            t += (t.length > 0 ? '\n' : '') + 'U';
                            ctx.fillStyle = '#0000ff';
                        }
                        ctx.fillText(t, LEFT_PAD + middlePad + offset *
                            CHAR_SPACE, (1 + info.seqs.length) * V_PER_SEQ + 30);
                    });
                    drawRegion(ctx, 
                        '#0000ff', 
                        LEFT_PAD + middlePad,
                        10,
                        CHAR_SPACE,
                        0,
                        71,
                        'FR1');
                    drawRegion(ctx, 
                        '#0000ff', 
                        LEFT_PAD + middlePad,
                        10,
                        CHAR_SPACE,
                        120,
                        158,
                        'FR2');
                    drawRegion(ctx, 
                        '#0000ff', 
                        LEFT_PAD + middlePad,
                        10,
                        CHAR_SPACE,
                        204,
                        308,
                        'FR3');

                    drawRegion(ctx, 
                        '#00ff00', 
                        LEFT_PAD + middlePad,
                        10,
                        CHAR_SPACE,
                        72,
                        119,
                        'CDR1');

                    drawRegion(ctx, 
                        '#00ff00', 
                        LEFT_PAD + middlePad,
                        10,
                        CHAR_SPACE,
                        159,
                        203,
                        'CDR2');

                    drawRegion(ctx, 
                        '#00ff00', 
                        LEFT_PAD + middlePad,
                        10,
                        CHAR_SPACE,
                        309,
                        351,
                        'CDR3');
                }

                var drawRegion = function(ctx, color, left, top, char_space, start, end, text) {
                    ctx.fillText(text, left + start * char_space, 10);
                    ctx.beginPath();
                    ctx.strokeStyle = color;
                    ctx.moveTo(left + start * char_space, top + 5);
                    ctx.lineTo(left + end * char_space + 10, top + 5);
                    ctx.stroke();
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
