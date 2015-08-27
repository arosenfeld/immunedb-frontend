(function() {
    'use strict';

    angular.module('ImmunologyApp') .factory('dnaCompare', ['$log', 'lookups',
            function($log, lookups) {

        var TOP_PAD = 45;
        var LEFT_PAD = 5;
        var CHAR_SPACE = 20;
        var V_PER_SEQ = 20;

        var getPhredColor = function(number) {
            return 'hsl(' + (number / 41 * 120) + ', 100%, 45%)';
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
            ctx.lineTo(left + end * char_space, top + 5);
            ctx.stroke();
        }

        var makeComparison = function(canvas, germline, regions, cdr3_num_nts, seqs,
                total_seqs, mutation_stats) {
            var ctx = canvas.getContext('2d');

            var labelMaxLength = 0;
            angular.forEach(seqs, function(v, k) {
                var label = v.sample.id + ': ' + v.seq_id;
                labelMaxLength = Math.max(label.length,
                    labelMaxLength);
            });

            canvas.width = (labelMaxLength + germline.length) * CHAR_SPACE;
            canvas.height = (seqs.length + 3) * V_PER_SEQ + 35;
            if (typeof mutation_stats != 'undefined') {
                canvas.height += 2 * V_PER_SEQ;
            }
            ctx.font = 'bold 12px Courier New';

            ctx.fillText('Germline', LEFT_PAD, TOP_PAD);
            var middlePad = (CHAR_SPACE - 10) * labelMaxLength;

            drawSequence(germline, ctx, middlePad, 0);

            var i = 0;
            var diffs = {}
            angular.forEach(seqs, function(seq, id) {
                ctx.fillStyle = '#000000';
                var label = seq.sample.id + ': ' + seq.seq_id;
                ctx.fillText(label, LEFT_PAD, TOP_PAD + V_PER_SEQ
                    * (1 + i));

                var filled_seq = germline.substr(0, seq.read_start) + seq.sequence.substr(seq.read_start, seq.length);
                angular.forEach(filled_seq, function(c, j) {
                    var left = LEFT_PAD + middlePad + (CHAR_SPACE * j);
                    var top = TOP_PAD + V_PER_SEQ * (i + 1);
                    var aaStart = j - (j % 3);
                    var nt;

                    if (j < seq.read_start) {
                        ctx.globalAlpha = 0.2;
                    }
                    nt = filled_seq.substring(aaStart, aaStart + 3);

                    if (lookups.aaLookup(nt) != null) {
                        ctx.fillStyle = lookups.aaColor(lookups.aaLookup(nt));
                    } else {
                        ctx.fillStyle = '#000000';
                    }

                    ctx.fillText(c, left, top);
                    ctx.globalAlpha = 1;

                    if (j in seq.mutations) {
                        if (
                                typeof mutation_stats != 'undefined' ||
                                (j < 309 || j >= 309 + cdr3_num_nts)
                           ) {
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
                    }
                    if (j == 0 || (j + 1) % 10 == 0) {
                        ctx.fillStyle = '#000000';
                        ctx.fillText(j + 1, left, 10);
                    }
                });
                i++;
            });

            if (typeof mutation_stats != 'undefined') {
                ctx.fillStyle = '#00ff00';
                ctx.fillText('Synonymous Mutation %', LEFT_PAD, TOP_PAD + (1 + seqs.length) * V_PER_SEQ);
                ctx.fillStyle = '#ff0000';
                ctx.fillText('Non-synonymous Mutation %', LEFT_PAD, TOP_PAD + (2 + seqs.length) * V_PER_SEQ);
                ctx.fillStyle = '#ff0055';
                ctx.fillText('Conserved %', LEFT_PAD + 15, TOP_PAD + (3 + seqs.length) * V_PER_SEQ);
                ctx.fillStyle = '#ff5500';
                ctx.fillText('Non-conserved %', LEFT_PAD + 15, TOP_PAD + (4 + seqs.length) * V_PER_SEQ);

                angular.forEach(mutation_stats['positions'], function(vals, offset) {
                    var synonymous = vals['synonymous'] || 0;
                    var conservative = vals['conservative'] || 0;
                    var nonConservative = vals['nonconservative'] || 0;
                    var unknown = vals['unknown'] || 0;

                    var silentPerc = Math.round(100 * synonymous /
                        total_seqs);
                    var nonSynonymous = Math.round(100 * (conservative +
                        nonConservative) / total_seqs);

                    var conservPerc = Math.round(100 * conservative /
                        total_seqs);
                    var nonConservPerc = Math.round(100 * nonConservative /
                        total_seqs);
                    ctx.font = '10px Courier New';
                    ctx.textAlign = 'center';
                    if (synonymous > 0) {
                        ctx.fillStyle = '#00ff00';
                        ctx.fillText(silentPerc, LEFT_PAD + middlePad + offset *
                        CHAR_SPACE + 5, TOP_PAD + (1 + seqs.length) * V_PER_SEQ);
                    }
                    if (nonSynonymous > 0) {
                        ctx.fillStyle = '#ff0000';
                        ctx.fillText(nonSynonymous, LEFT_PAD + middlePad + offset *
                            CHAR_SPACE + 5, TOP_PAD + (2 + seqs.length) * V_PER_SEQ);
                        ctx.fillStyle = '#ff0055';
                        ctx.fillText(conservPerc, LEFT_PAD + middlePad + offset *
                            CHAR_SPACE + 5, TOP_PAD + (3 + seqs.length) * V_PER_SEQ);
                        ctx.fillStyle = '#ff5500';
                        ctx.fillText(nonConservPerc, LEFT_PAD + middlePad + offset *
                            CHAR_SPACE + 5, TOP_PAD + (4 + seqs.length) * V_PER_SEQ);
                    }

                });
            } else if (seqs[0].quality != 'undefined') {
                ctx.fillStyle = '#777777';
                ctx.fillText('Phred Quality Score (Range: 0 - 41)', LEFT_PAD, TOP_PAD + (1 + seqs.length) * V_PER_SEQ);
                ctx.font = '10px Courier New';
                ctx.textAlign = 'center';
                angular.forEach(seqs[0].quality, function(c, offset) {
                    var left = LEFT_PAD + middlePad + (CHAR_SPACE * offset);
                    if (c != ' ') {
                        var quality = c.charCodeAt(0) - 33;
                        ctx.fillStyle = getPhredColor(quality);

                        ctx.fillText(quality, LEFT_PAD + middlePad + offset *
                            CHAR_SPACE + 5, TOP_PAD + (1 + seqs.length) * V_PER_SEQ);
                    }
                });
            }

            ctx.textAlign = 'left';
            ctx.font = 'bold 12px Courier New';

            var region_info = [
                {
                    'name': 'FR1',
                    'color': '#0000ff'
                },{
                    'name': 'CDR1',
                    'color': '#00ff00'
                },{
                    'name': 'FR2',
                    'color': '#0000ff'
                },{
                    'name': 'CDR2',
                    'color': '#00ff00'
                },{
                    'name': 'FR3',
                    'color': '#0000ff'
                },
                {
                    'name': 'CDR3',
                    'color': '#00ff00'
                },{
                    'name': 'FR4',
                    'color': '#0000ff'
                },
            ];

            var offset = 0;
            angular.forEach(region_info, function(region, i) {
                var size = regions[i];
                drawRegion(ctx,
                    region.color,
                    LEFT_PAD + middlePad,
                    25,
                    CHAR_SPACE,
                    offset,
                    offset + size - .4,
                    region.name);
                offset += size;
            });
        }

        return { makeComparison: makeComparison };
    }]);
})();
