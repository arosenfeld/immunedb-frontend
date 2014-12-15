(function() {
    'use strict';

    angular.module('ImmunologyApp').factory('lineage', ['lookups', '$log',
        function(lookups, $log) {
            return {
                makeTree: function(jsonPath, elemName, colorBy) {
                        d3.select(elemName + ' > *').remove();
                        var vis = d3.select(elemName).append('svg:svg')
                              .attr('width', '100%')
                              .attr('height', 500)
                              .append('svg:g')
                              .attr('transform', 'translate(40, 0)')
                         
                        var tree = d3.layout.tree().size([500,500]);

                        var tip = d3.tip()
                            .attr('class', 'd3-tip')
                            .offset([-10, 0])
                            .html(function(d) {
                                var label = '<span style="color: #a0a0a0">Copy Number: </span>' + d.data.copy_number + '<br/>';
                                label += '<span style="color: #a0a0a0">Seq ID(s): </span><br/>';
                                if (d.data.seq_ids.length > 0) {
                                    angular.forEach(d.data.seq_ids, function(val, key) {
                                        label += val + '<br/>';
                                    });
                                } else {
                                    label += 'Inferred Sequence<br/>';
                                }
                                label += '<span style="color:#a0a0a0">Mutations: </span>: <br/>'
                                angular.forEach(d.data.mutations, function(val, key) {
                                    label += val.from + ' ' + val.pos + ' ' + val.to +
                                        '<br/>';
                                });
                                return label;
                            });
                        vis.call(tip);

                        d3.json(jsonPath, function(error, root) {
                            var nodes = tree.nodes(root);
                            var links = tree.links(nodes);
                            var diagonal = d3.svg.diagonal().projection(function(d) { return [d.y, d.x]; });

                            var link = vis.selectAll('pathlink')
                                .data(links)
                                .enter().append('svg:path')
                                .attr('class', 'link')
                                .attr('d', diagonal);

                            var node = vis.selectAll('g.node')
                                .data(nodes)
                                .enter().append('svg:g')
                                .attr('transform', function(d) { return 'translate(' + d.y + ',' + d.x + ')'; });

                            node.append('svg:circle')
                                .attr('r', function(d) {
                                    if (d.data.copy_number == 0) {
                                        return 2;
                                    }
                                    return 2 * (1 + Math.log(d.data.copy_number));
                                })
                                .attr('fill', function(d) {
                                    if(d.data.seq_ids.length == 0) {
                                        return '#000000';
                                    } else if(typeof d.data[colorBy] !=
                                        'undefined' && d.data[colorBy].length > 0) {
                                        return '#' +
                                            lookups.attribToColor(d.data[colorBy]);
                                    }
                                    return '#0000ff';
                                });

                            vis.selectAll('circle')
                                .data(nodes)
                                    .on('mouseover', tip.show)
                                    .on('mouseout', tip.hide);

                            node.append('svg:text')
                                .attr('dx', function(d) { return d.children ? -8 : 8; })
                                .attr('dy', 3)
                                .attr('text-anchor', function(d) { return d.children ? 'end' : 'start'; })
                                .text(function(d) { return d.data.mutations.length; });
                    });
                }
            };
        }
    ]);
})();
