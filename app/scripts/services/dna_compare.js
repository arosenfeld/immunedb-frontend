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

        var drawRegion = function(ctx, color, left, top, char_space, start, end, text) {
            ctx.fillStyle = '#000000';
            ctx.fillText(text, left + start * char_space, top);
            ctx.beginPath();
            ctx.strokeStyle = color;
            ctx.moveTo(left + start * char_space, top + 5);
            ctx.lineTo(left + end * char_space + 11, top + 5);
            ctx.stroke();
        }

        var makeComparison = function(canvas, germline, cdr3, cdr3_num_nts, seqs, summary) {
            var ctx = canvas.getContext('2d');

            var labelMaxLength = 0;
            angular.forEach(seqs, function(v, k) {
                var label = v.sample.id + ': ' + v.seq_id;
                labelMaxLength = Math.max(label.length,
                    labelMaxLength);
            });

            canvas.width = (labelMaxLength + germline.length) * CHAR_SPACE;
            canvas.height = (seqs.length + 3) * V_PER_SEQ + 35;
            if (summary) {
                canvas.height += 2 * V_PER_SEQ;
            }
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

                    var mutation = seq.mutations[j];
                    if ('CUS'.indexOf(mutation) >= 0) {
                            ctx.beginPath();
                            ctx.rect(left - 2, top - CHAR_SPACE + 8, 15, 15);
                            ctx.lineWidth = 2;
                            if (!(j in diffs)) {
                                diffs[j] = { 'silent': 0, 'change': 0,
                                'conserved': 0, 'unconserved': 0 }
                            }

                            if (mutation == 'C') {
                                ctx.strokeStyle = '#ff0000';
                                diffs[j]['conserved']++;
                                diffs[j]['change']++;
                            } else if (mutation == 'U') {
                                ctx.strokeStyle = '#ff0000';
                                diffs[j]['unconserved']++;
                                diffs[j]['change']++;
                            } else if (mutation == 'S') {
                                ctx.strokeStyle = '#00ff00';
                                diffs[j]['silent']++;
                            }

                            ctx.stroke();
                    }
                    ctx.fillText(c, left, top);
                    if (j % 10 == 0) {
                        ctx.fillStyle = '#000000';
                        ctx.fillText(j, left, 10);
                    }
                });
                i++;
            });

            if (summary) {
                ctx.fillStyle = '#00ff00';
                ctx.fillText('Synonymous Mutation %', LEFT_PAD, TOP_PAD + (1 + seqs.length) * V_PER_SEQ);
                ctx.fillStyle = '#ff0000';
                ctx.fillText('Non-synonymous Mutation %', LEFT_PAD, TOP_PAD + (2 + seqs.length) * V_PER_SEQ);
                ctx.fillStyle = '#ff0055';
                ctx.fillText('Conserved % of non-synonymous', LEFT_PAD + 15, TOP_PAD + (3 + seqs.length) * V_PER_SEQ);
                ctx.fillStyle = '#ff5500';
                ctx.fillText('Non-conserved % of non-synonymous', LEFT_PAD + 15, TOP_PAD + (4 + seqs.length) * V_PER_SEQ);
            }


            angular.forEach(diffs, function(vals, offset) {
                var t = '';
                var silentPerc = Math.round(100 * vals['silent'] /
                    seqs.length);
                var changePerc = Math.round(100 * vals['change'] /
                    seqs.length);
                var conservPerc = Math.round(100 * vals['conserved'] /
                    vals['change']);
                var nonConservPerc = Math.round(100 * vals['unconserved'] /
                    vals['change']);
                ctx.font = '10px Courier New';
                ctx.textAlign = 'center';
                ctx.fillStyle = '#00ff00';
                ctx.fillText(silentPerc, LEFT_PAD + middlePad + offset *
                    CHAR_SPACE + 5, TOP_PAD + (1 + seqs.length) * V_PER_SEQ);
                ctx.fillStyle = '#ff0000';
                ctx.fillText(changePerc, LEFT_PAD + middlePad + offset *
                    CHAR_SPACE + 5, TOP_PAD + (2 + seqs.length) * V_PER_SEQ);
                if (changePerc > 0) {
                    ctx.fillStyle = '#ff0055';
                    ctx.fillText(conservPerc, LEFT_PAD + middlePad + offset *
                        CHAR_SPACE + 5, TOP_PAD + (3 + seqs.length) * V_PER_SEQ);
                    ctx.fillStyle = '#ff5500';
                    ctx.fillText(nonConservPerc, LEFT_PAD + middlePad + offset *
                        CHAR_SPACE + 5, TOP_PAD + (4 + seqs.length) * V_PER_SEQ);
                }

            });

            ctx.textAlign = 'left';
            ctx.font = 'bold 12px Courier New';

            var regions = [
                {
                    'name': 'FR1',
                    'start': 0,
                    'end': 77,
                    'color': '#0000ff'
                },{
                    'name': 'CDR1',
                    'start': 78,
                    'end': 113,
                    'color': '#00ff00'
                },{
                    'name': 'FR2',
                    'start': 114,
                    'end': 164,
                    'color': '#0000ff'
                },{
                    'name': 'CDR2',
                    'start': 165,
                    'end': 194,
                    'color': '#00ff00'
                },{
                    'name': 'FR3',
                    'start': 195,
                    'end': 308,
                    'color': '#0000ff'
                },{
                    'name': 'CDR3',
                    'start': 309,
                    'end': 308 + cdr3_num_nts,
                    'color': '#00ff00'
                },
            ];

            angular.forEach(regions, function(region, i) {
                drawRegion(ctx, 
                    region.color,
                    LEFT_PAD + middlePad,
                    25,
                    CHAR_SPACE,
                    region.start,
                    region.end,
                    region.name);
            });

        }

        return { makeComparison: makeComparison };
    }]);
})();
