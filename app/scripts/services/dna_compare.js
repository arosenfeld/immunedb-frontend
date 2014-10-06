(function() {
    'use strict';

    angular.module('ImmunologyApp') .factory('dnaCompare', ['$log', 'lookups',
            function($log, lookups) {

        var TOP_PAD = 45;
        var LEFT_PAD = 5;
        var CHAR_SPACE = 20;
        var V_PER_SEQ = 20;

        var correctGermline = function(germ, seq) {
            // CDR3 starts @ nucleotide 309
            return germ.substring(0, 309) + seq + germ.substring(309 +
                seq.length, germ.length);
        }

        var drawSequence = function(seq, ctx, left, top) {
            angular.forEach(seq, function(c, i) {
                if (i % 3 == 0) {
                    var nt = seq.substring(i, i + 3);
                    if (lookups.aaLookup(nt) != null) {
                        ctx.fillStyle = lookups.aaColor(lookups.aaLookup(nt));
                    } else {
                        ctx.fillStyle = '#000000';
                    }
                }

                ctx.fillText(c, LEFT_PAD + left + (CHAR_SPACE * i), TOP_PAD + top);
            });
        }

        var makeComparison = function(canvas, germline, cdr3, seqs) {
            var ctx = canvas.getContext('2d');

            var labelMaxLength = 0;
            angular.forEach(seqs, function(v, k) {
                var label = v.sample.id + ': ' + v.seq_id;
                labelMaxLength = Math.max(label.length,
                    labelMaxLength);
            });

            canvas.width = (labelMaxLength + germline.length) * CHAR_SPACE;
            canvas.height = (seqs.length + 2) * V_PER_SEQ + 35;
            ctx.font = 'bold 12px Courier New';

            ctx.fillText('Germline', LEFT_PAD, TOP_PAD);
            var middlePad = (CHAR_SPACE - 12) * labelMaxLength;
            // TODO: There must be a better way to do this
            germline = correctGermline(germline, seqs[0].junction_nt);

            drawSequence(germline, ctx, middlePad, 0);

            var i = 0;
            var diffs = {}
            angular.forEach(seqs, function(seq, id) {
                ctx.fillStyle = '#000000';
                var label = seq.sample.id + ': ' + seq.seq_id;
                ctx.fillText(label, LEFT_PAD, TOP_PAD + V_PER_SEQ
                    * (1 + i));

                angular.forEach(seq.sequence, function(c, j) {
                    var left = LEFT_PAD + middlePad + (CHAR_SPACE * j);
                    var top = TOP_PAD + V_PER_SEQ * (i + 1);
                    var aaStart = j - (j % 3);
                    var nt = seq.sequence.substring(aaStart, aaStart + 3);

                    if (lookups.aaLookup(nt) != null) {
                        ctx.fillStyle = lookups.aaColor(lookups.aaLookup(nt));
                    } else {
                        ctx.fillStyle = '#000000';
                    }

                    // TODO: Compare with one change, not against
                    // germline
                    if (seq.sequence[j] != germline[j]) {
                        var gAA = lookups.aaLookup(germline.substring(aaStart,
                            aaStart + 3));
                        var sAA = lookups.aaLookup(seq.sequence.substring(
                            aaStart, aaStart + 3));

                        if (gAA != null && sAA != null) {
                            ctx.beginPath();
                            ctx.rect(left - 2, top - CHAR_SPACE + 8, 15, 15);
                            ctx.lineWidth = 2;
                            if (!(j in diffs)) {
                                diffs[j] = { 'silent': 0, 'change': 0 }
                            }

                            if (gAA != sAA) {
                                ctx.strokeStyle = '#ff0000';
                                diffs[j]['change']++;
                            } else if (gAA == sAA) {
                                ctx.strokeStyle = '#00ff00';
                                diffs[j]['silent']++;
                            }

                            ctx.stroke();
                        }
                    }
                    ctx.fillText(c, left, top);
                    if (j % 10 == 0) {
                        ctx.fillStyle = '#000000';
                        ctx.fillText(j, left, 10);
                    }
                });
                i++;
            });

            angular.forEach(diffs, function(vals, offset) {
                var t = '';
                if (vals['silent'] >= seqs.length / 2.0) {
                    t = 'S';
                    ctx.fillStyle = '#00ff00';
                } else if (vals['change'] >= seqs.length / 2.0) {
                    t += (t.length > 0 ? '\n' : '') + 'N';
                    ctx.fillStyle = '#ff0000';
                }
                ctx.fillText(t, LEFT_PAD + middlePad + offset * CHAR_SPACE,
                        (1 + seqs.length) * V_PER_SEQ + 45);
            });

            // TODO: Loop this
            drawRegion(ctx, 
                '#0000ff', 
                LEFT_PAD + middlePad,
                25,
                CHAR_SPACE,
                0,
                77,
                'FR1');
            drawRegion(ctx, 
                '#0000ff', 
                LEFT_PAD + middlePad,
                25,
                CHAR_SPACE,
                114,
                164,
                'FR2');
            drawRegion(ctx, 
                '#0000ff', 
                LEFT_PAD + middlePad,
                25,
                CHAR_SPACE,
                195,
                308,
                'FR3');
            drawRegion(ctx, 
                '#00ff00', 
                LEFT_PAD + middlePad,
                25,
                CHAR_SPACE,
                78,
                113,
                'CDR1');

            drawRegion(ctx, 
                '#00ff00', 
                LEFT_PAD + middlePad,
                25,
                CHAR_SPACE,
                165,
                194,
                'CDR2');
            drawRegion(ctx, 
                '#00ff00', 
                LEFT_PAD + middlePad,
                25,
                CHAR_SPACE,
                309,
                308 + cdr3.length * 3,
                'CDR3');

        }

        var drawRegion = function(ctx, color, left, top, char_space, start, end, text) {
            ctx.fillStyle = '#000000';
            ctx.fillText(text, left + start * char_space, top);
            ctx.beginPath();
            ctx.strokeStyle = color;
            ctx.moveTo(left + start * char_space, top + 5);
            ctx.lineTo(left + end * char_space + 11, top + 5);
            ctx.stroke();
        }

        return { makeComparison: makeComparison };
    }]);
})();
