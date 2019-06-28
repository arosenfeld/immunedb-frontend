import 'lineage.css';

import d3 from 'd3';
import d3tip from 'd3-tip';
import md5 from 'js-md5';

import React from 'react';

import API from '../api';
import Message from './message';

import { getMetadataFields } from '../utils';

export default class CloneLineage extends React.Component {
  static strToColor = (str) => {
    var hash = 5947;
    for (var i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
        hash = hash & hash;
    }
    hash = md5.array(hash.toString())[0];
    return 'hsl(' + (hash % 360) + ', 100%, 30%)';
  }

  constructor() {
    super();
    this.state = {
      asyncState: 'loading',
      colorBy: 'tissue',
      samples: [],
      treeInfo: {
        min_count: 0,
        min_samples: 0
      }
    };
  }

  componentDidMount() {
    API.post('clone/lineage/' + this.props.cloneId).end((err, response) => {
      if (err) {
        this.setState({ asyncState: 'error' });
      } else {
        this.setState({
          asyncState: 'loaded',
          treeInfo: response.body
        }, this.draw);
      }
    })
  }

  componentDidUpdate() {
    $('.ui.dropdown').dropdown({
      action: 'hide',
      onChange: (value, text) => {
        this.setState({
          colorBy: value
        }, this.draw);
      }
    });
  }

  draw = () => {
    if (!this.state.treeInfo) {
      return;
    }
    d3.select('#tree > *').remove();
    let width = $('#tree').width();
    let height = 800;
    let offset = [0, 0];
    let zoom = () => {
      vis.attr('transform', 'translate(' +
        d3.event.translate + ')scale(' + d3.event.scale + ')');
    }

    let drag = d3.behavior.drag()
      .on('drag', (d) => {
          offset[0] += d3.event.dx;
          offset[1] += d3.event.dy;
          vis.attr('transform', 'translate(' + offset + ')');
      });

    let vis = d3.select('#tree').append('svg')
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

    let scaleCircle = (cn) => cn == 0 ? 2 : 2 * (1 + Math.log(cn));

    let tree = d3.layout.tree().nodeSize([50, 50]);
    if (this.state.hideLargeLeaves) {
      tree.children((d) => {
        if (d.children.length < 50) {
          return d.children;
        }
        d['hiding'] = true;
        return [];
      });
    }

    let tip = d3tip()
      .attr('class', 'd3-tip')
      .offset([-10, 0])
      .html((d) => {
        let label = '';
        if (_.keys(d.data.seq_ids).length == 0){
          label += 'Inferred Sequence<br/>'
        } else {
          label += '<span style="color: #a0a0a0">Copy Number: </span>' + d.data.copy_number + '<br/>';
          _.forEach(d.data.metadata, (v, k) => {
            label += '<span style="color: #a0a0a0">' + _.startCase(k) + 's: </span>' + v + '<br/>';
          })

          label += '<span style="color: #a0a0a0">Seq ID(s): </span><br/>';
          _.each(_.keys(d.data.seq_ids).slice(0, 25), (val, key) => {
            label += val + ' in <span style="color: #a0a0a0">' + d.data.seq_ids[val].sample_name + '</span><br/>';
          });
          if (_.keys(d.data.seq_ids).length > 25) {
            label += '... ' + (_.keys(d.data.seq_ids).length - 25) + ' more ...<br/>';
          }
        }
        label += '<span style="color: #a0a0a0">Node ID: </span>' + d.data.node_id + '<br/>';
        label += '<span style="color:#a0a0a0">Mutations: </span><br/>'
        let muts = d.data.mutations.sort((a, b) => {
          return parseInt(a.pos) - parseInt(b.pos);
        });
        _.each(muts, (val, key) => {
          label += val.from + ' ' + val.pos + ' ' + val.to + '<br/>';
        });
        return label;
      });
    vis.call(tip);

    let diagonal = d3.svg.diagonal()
      .projection((d) => [d.x + width / 2, d.y + 25]);
    let nodes = tree.nodes(this.state.treeInfo.tree);
    let links = tree.links(nodes);

    let link = vis.selectAll('pathlink')
      .data(links)
      .enter().append('svg:path')
      .attr('class', 'link')
      .attr('d', diagonal);

    let node = vis.selectAll('g.node')
      .data(nodes)
      .enter().append('svg:g')
      .attr('transform', (d) => {
        let x = d.x + width / 2;
        let y = d.y + 25;
        return 'translate(' + x + ',' + y + ')';
      });

    node.append('svg:circle')
      .attr('r', (d) => scaleCircle(d.data.copy_number))
      .attr('fill', (d) => {
        if(_.keys(d.data.seq_ids).length == 0) {
          return '#000000';
        } else if (d.data.metadata[this.state.colorBy] && d.data.metadata[this.state.colorBy].length > 0) {
          return CloneLineage.strToColor(d.data.metadata[this.state.colorBy].join());
        }
        return '#0000ff';
      });

    vis.selectAll('circle')
      .data(nodes)
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide);

    node.append('svg:text')
      .attr('dx', (d) => {
        let off = scaleCircle(d.data.copy_number);
        return d.children ? -6 - off : 6 + off;
      })
      .attr('dy', 3)
      .attr('text-anchor', (d) => d.children ? 'end' : 'start')
      .text((d) => {
        if (d.depth == 0) {
          return 'Germline';
        }
        return d.data.mutations.length;
      });
  }

  render() {
    if (this.state.asyncState == 'loading') {
      return <Message type='' icon='notched circle loading' header='Loading'
              message='Gathering lineage information' />;
    } else if (this.state.asyncState == 'error') {
      return <Message type='error' icon='warning sign' header='Error'
              message='Unable to fetch lineage information' />;
    }

    if (!this.state.treeInfo) {
      return (
        <div className="ui teal segment">
          <h4>Lineage</h4>
          <div className="ui message warning">
            A linage has not been created for this clone.
          </div>
        </div>
      );
    }

    return (
      <div className="ui teal segment">
        <h4>Lineage</h4>
        <div className="ui info message">
          The following filters have been applied to this clone's lineage:
          <ul>
            <li>Mutations must have a copy number of at least
              <strong> {this.state.treeInfo.info.min_mut_copies}</strong></li>
            <li>Mutations must occur in at least
              <strong> {this.state.treeInfo.info.min_mut_samples}</strong> samples</li>
            <li>Sequences must have a subject-level copy number of at least
              <strong> {this.state.treeInfo.info.min_seq_copies}</strong></li>
            <li>Sequences must occur in at least
              <strong> {this.state.treeInfo.info.min_seq_samples}</strong> samples</li>
            <li>Sequences with stop codons have been
              <strong> {this.state.treeInfo.info.exclude_stops ? 'excluded' :
                'included'}</strong></li>
          </ul>
        </div>
        <div className="ui form">
          <div className="one wide field">
            <label>Color By...</label>
            <select className="ui dropdown" defaultValue={this.state.colorBy}>
              {_.map(getMetadataFields(this.props.samples), m =>
                <option value={m} key={m}>{_.startCase(m)}</option>
              )}
            </select>
          </div>
        </div>
        <div id="tree" className="ui segment"></div>
      </div>
    );
  }
}
