(function() {
    'use strict';

    angular.module('ImmunologyApp').factory('lineage', ['lookups', '$log',
        function(lookups, $log) {
            return {
                makeTree: function(jsonPath, elemName, colorBy) {
                        d3.select(elemName + ' > *').remove();
                        var diameter = 960;

                        var tree = d3.layout.tree()
                            .separation(function(a, b) { return (a.parent == b.parent ? 1 : 2) / a.depth; })
                            .size([360, diameter / 2]);


                        var diagonal = d3.svg.diagonal.radial().projection(
                            function(d) { return [d.y, d.x / 180 * Math.PI];
                        });

                        var vis = d3.select(elemName).append('svg:svg')
                              .attr("width", diameter)
                              .attr("height", diameter)
                              .append('svg:g')
                              .attr("transform", "translate(" + diameter / 2 +
                              "," + diameter / 2 + ")");

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

                            var link = vis.selectAll('pathlink')
                                .data(links)
                                .enter().append('svg:path')
                                .attr('class', 'link')
                                .attr('d', diagonal);

                            var node = vis.selectAll('g.node')
                                .data(nodes)
                                .enter().append('svg:g')
                                .attr('transform', function(d) { return 'rotate(' + (d.x - 90) + ')translate(' + d.y + ')'; });

                            node.append('svg:circle')
                                .attr('r', function(d) {
                                    if (d.data.copy_number == 0) {
                                        return 2;
                                    }
                                    return 2 * (1 + Math.log(d.data.copy_number));
                                })
                                .attr('fill', function(d, i) {
                                    if(i == 0) {
                                        return '#949494';
                                    } else if(d.data.seq_ids.length == 0) {
                                        return '#000000';
                                    } else if(typeof d.data[colorBy] !=
                                        'undefined' && d.data[colorBy].length > 0) {
                                        $log.debug(lookups.attribToColor(d.data[colorBy]));
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
                                .attr("text-anchor", function(d) { return d.x < 180 ? "start" : "end"; })
                                .attr("transform", function(d) { return d.x < 180 ? "translate(8)" : "rotate(180)"; })
                                .attr('dy', '.31em')
                                .text(function(d) { return d.data.mutations.length; });
                    });
                    d3.select(elemName).style("height", diameter + "px");
                }
            };
        }
    ]);
})();
