(function() {
    'use strict';

    angular.module('ImmunologyApp').factory('lineage', ['lookups', '$log',
        function(lookups, $log) {
            return {
                makeTree: function(jsonPath, elemName, colorBy, hideLargeLeaves, finishCb) {
                    d3.select(elemName + ' > *').remove();
                    var width = $(elemName).width();
                    var height = 800;
                    var offset = [0, 0];
                    var zoom = function() {
                      vis.attr('transform', 'translate(' +
                          d3.event.translate + ')scale(' + d3.event.scale + ')');
                    }

                    var drag = d3.behavior.drag()
                        .on('drag', function(d) {
                            offset[0] += d3.event.dx;
                            offset[1] += d3.event.dy;
                            vis.attr('transform', 'translate(' + offset + ')');
                        });

                    var vis = d3.select(elemName).append('svg')
                          .attr('width', width)
                          .attr('height', height)
                          .append('g')
                          .call(drag)
                          .call(d3.behavior.zoom().on('zoom', zoom));

                    vis.append('rect')
                        .attr('class', 'overlay')
                        .attr('width', width)
                        .attr('height', height);
                    vis = vis.append('g');

                    var scaleCircle = function(cn) {
                        if (cn == 0) {
                            return 2;
                        }
                        return 2 * (1 + Math.log(cn));
                    }

                    var tree = d3.layout.tree().nodeSize([50, 50]);
                    if (hideLargeLeaves) {
                        tree.children(function(d) {
                            if (d.children.length < 50) {
                                return d.children;
                            }
                            d['hiding'] = true;
                            return [];
                        });
                    }

                    var tip = d3.tip()
                        .attr('class', 'd3-tip')
                        .offset([-10, 0])
                        .html(function(d) {
                            var label = '';
                            if (d.data.seq_ids.length == 0){
                                label += 'Inferred Sequence<br/>'
                            } else {
                                label += '<span style="color: #a0a0a0">Copy Number: </span>' + d.data.copy_number + '<br/>';
                                label += '<span style="color: #a0a0a0">Tissue(s): </span>' + d.data.tissues + '<br/>';
                                if (d.data.subsets.length > 0) {
                                    label += '<span style="color: #a0a0a0">Subsets(s): </span>' + d.data.subsets + '<br/>';
                                }
                                label += '<span style="color: #a0a0a0">Seq ID(s): </span><br/>';
                                angular.forEach(d.data.seq_ids.slice(0, 25), function(val, key) {
                                    label += val + '<br/>';
                                });
                                if (d.data.seq_ids.length > 25) {
                                    label += '... ' + (d.data.seq_ids.length - 25) + ' more ...<br/>';
                                }
                            }
                            label += '<span style="color:#a0a0a0">Mutations: </span><br/>'
                            var muts = d.data.mutations.sort(function(a, b) {
                                return parseInt(a.pos) - parseInt(b.pos);
                            });
                            angular.forEach(muts, function(val, key) {
                                label += val.from + ' ' + val.pos + ' ' + val.to +
                                    '<br/>';
                            });
                            return label;
                        });
                    vis.call(tip);

                    var diagonal = d3.svg.diagonal()
                        .projection(function(d) { return [d.x + width / 2,
                        d.y + 25]; });
                    d3.json(jsonPath, function(error, root) {
                        if (error != null) {
                            finishCb(false);
                            return;
                        }
                        var nodes = tree.nodes(root);
                        var links = tree.links(nodes);

                        var link = vis.selectAll('pathlink')
                            .data(links)
                            .enter().append('svg:path')
                            .attr('class', 'link')
                            .attr('d', diagonal);

                        var node = vis.selectAll('g.node')
                            .data(nodes)
                            .enter().append('svg:g')
                            .attr('transform', function(d) {
                                var x = d.x + width / 2;
                                var y = d.y + 25;
                                return 'translate(' + x + ',' + y + ')';
                            });

                        node.append('svg:circle')
                            .attr('r', function(d) {
                                return scaleCircle(d.data.copy_number);
                            })
                            .attr('fill', function(d) {
                                if(d.data.seq_ids.length == 0) {
                                    return '#000000';
                                } else if(typeof d.data[colorBy] != 'undefined' && d.data[colorBy].length > 0) {
                                    return lookups.attribToColor(d.data[colorBy]);
                                }
                                return '#0000ff';
                            });

                        vis.selectAll('circle')
                            .data(nodes)
                                .on('mouseover', tip.show)
                                .on('mouseout', tip.hide);

                        node.append('svg:text')
                            .attr('dx', function(d) {
                                var off = scaleCircle(d.data.copy_number);
                                return d.children ? -6 - off : 6 + off;
                            })
                            .attr('dy', 3)
                            .attr('text-anchor', function(d) { return d.children ? 'end' : 'start'; })
                            .text(function(d) {
                                if (d.depth == 0) {
                                    return 'Germline';
                                }
                                return d.data.mutations.length;
                            });
                        finishCb(true);
                    });
                }
            };
        }
    ]);
})();
