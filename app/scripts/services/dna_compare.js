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

        var makeComparison = function(canvas, germline, cdr3_num_nts, seqs,
                total_seqs, pos_stats) {
            var ctx = canvas.getContext('2d');

            var labelMaxLength = 0;
            angular.forEach(seqs, function(v, k) {
                var label = v.sample.id + ': ' + v.seq_id;
                labelMaxLength = Math.max(label.length,
                    labelMaxLength);
            });

            canvas.width = (labelMaxLength + germline.length) * CHAR_SPACE;
            canvas.height = (seqs.length + 3) * V_PER_SEQ + 35;
            if (typeof pos_stats != 'undefined') {
                canvas.height += 2 * V_PER_SEQ;
            }
            ctx.font = 'bold 12px Courier New';

            ctx.fillText('Germline', LEFT_PAD, TOP_PAD);
            var middlePad = (CHAR_SPACE - 12) * labelMaxLength;

            drawSequence(germline, ctx, middlePad, 0);

            var i = 0;
            var diffs = {}
            angular.forEach(seqs, function(seq, id) {
                ctx.fillStyle = '#000000';
                var label = seq.sample.id + ': ' + seq.seq_id;
                ctx.fillText(label, LEFT_PAD, TOP_PAD + V_PER_SEQ
                    * (1 + i));

                ctx.beginPath();
                ctx.strokeStyle = '#db0004';

                ctx.globalAlpha = 0.3;
                ctx.lineWidth = 2;
                ctx.moveTo(LEFT_PAD + middlePad - 2,
                           TOP_PAD + V_PER_SEQ * (i + 1) + 3);
                ctx.lineTo(LEFT_PAD + middlePad + (seq.v_extent - 1) *
                            CHAR_SPACE + 8,
                           TOP_PAD + V_PER_SEQ * (i + 1) + 3);
                ctx.stroke();
                ctx.beginPath();
                ctx.strokeStyle = '#1d912c';
                var jStart = (seq.sequence.length - seq.j_length) * CHAR_SPACE;
                ctx.moveTo(LEFT_PAD + middlePad + jStart - 3,
                           TOP_PAD + V_PER_SEQ * (i + 1) + 3);
                ctx.lineTo(LEFT_PAD + middlePad + jStart + seq.j_length *
                           CHAR_SPACE - 3,
                           TOP_PAD + V_PER_SEQ * (i + 1) + 3);
                ctx.stroke()
                ctx.globalAlpha = 1;

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

                    if (j < seq.read_start) {
                        ctx.globalAlpha = 0.4;
                    }
                    ctx.fillText(c, left, top);
                    ctx.globalAlpha = 1;

                    if (j in seq.mutations) {
                        ctx.beginPath();
                        ctx.rect(left - 2, top - CHAR_SPACE + 8, 15, 15);
                        ctx.lineWidth = 2;

                        switch (seq.mutations[j]) {
                            case 'conservative':
                            case 'nonconservative':
                                ctx.strokeStyle = '#ff0000';
                                break;
                            case 'synonymous':
                                ctx.strokeStyle = '#00ff00';
                                break;
                            case 'unknown':
                                ctx.strokeStyle = '#1c1c1c';
                                break;
                        }

                        ctx.stroke();

                    }
                    if (j == 0 || (j + 1) % 10 == 0) {
                        ctx.fillStyle = '#000000';
                        ctx.fillText(j + 1, left, 10);
                    }
                });
                i++;
            });

            if (typeof pos_stats != 'undefined') {
                ctx.fillStyle = '#00ff00';
                ctx.fillText('Synonymous Mutation %', LEFT_PAD, TOP_PAD + (1 + seqs.length) * V_PER_SEQ);
                ctx.fillStyle = '#ff0000';
                ctx.fillText('Non-synonymous Mutation %', LEFT_PAD, TOP_PAD + (2 + seqs.length) * V_PER_SEQ);
                ctx.fillStyle = '#ff0055';
                ctx.fillText('Conserved %', LEFT_PAD + 15, TOP_PAD + (3 + seqs.length) * V_PER_SEQ);
                ctx.fillStyle = '#ff5500';
                ctx.fillText('Non-conserved %', LEFT_PAD + 15, TOP_PAD + (4 + seqs.length) * V_PER_SEQ);

                angular.forEach(pos_stats, function(vals, offset) {
                    var nonsynonymous = vals['conservative'] +
                        vals['nonconservative'];
                    var silentPerc = Math.round(100 * vals['synonymous'] /
                        total_seqs);
                    var changePerc = Math.round(100 * nonsynonymous / total_seqs);
                    var conservPerc = Math.round(100 * vals['conservative'] /
                        total_seqs);
                    var nonConservPerc = Math.round(100 * vals['nonconservative'] /
                        total_seqs);
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
            }

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
                },{
                    'name': 'FR4',
                    'start': 308 + cdr3_num_nts + 1,
                    'end': germline.length - 1,
                    'color': '#0000ff'
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
