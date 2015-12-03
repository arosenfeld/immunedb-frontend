// TODO: Combine this with cloneList
import numeral from 'numeral';

import React from 'react';
import { Link } from 'react-router';

import API from '../api';
import GeneCollapser from './geneCollapser';
import Message from './message';
import { colorAAs } from '../utils';

export default class SampleCloneOverlaps extends React.Component {
  constructor() {
    super();
    this.state = {
      asyncState: 'loading',

      page: 1,
      perPage: 15,

      clones: [],
      expanded: []
    };
  }

  componentDidMount() {
    this.update();
  }

  componentDidUpdate() {
    $('.ties').popup({
      position: 'bottom left'
    });
  }

  nextPage = () => {
    this.setState({
      asyncState: 'paging',
      page: this.state.page + 1
    }, this.update);
  }

  prevPage = () => {
    this.setState({
      asyncState: 'paging',
      page: Math.max(0, this.state.page - 1)
    }, this.update);
  }

  update = () => {
    API.post('samples/overlap/' + this.props.sampleEncoding, {
      page: this.state.page,
      perPage: this.state.perPage
    }).end((err, response) => {
      if (err) {
        this.setState({asyncState: 'error'});
      } else {
        this.setState({
          asyncState: 'loaded',
          clones: response.body
        });
      }
    });
  }

  expand = (sampleId) => {
    let expanded = this.state.expanded.slice();
    if (_.includes(this.state.expanded, sampleId)) {
      expanded = _.remove(expanded, sampleId);
    } else {
      expanded.push(sampleId);
    }
    this.setState({
      expanded
    });
  }


  getCloneRows = (cloneInfo) => {
    let rows = [
      <tr key={cloneInfo.clone.id + '_info'}>
        <td>
          <a href={'/clone/' + cloneInfo.clone.id} target="_blank">
            {cloneInfo.clone.id}
          </a>
        </td>
        <td>{cloneInfo.clone.subject.identifier}</td>
        <td>
          <GeneCollapser gene={cloneInfo.clone.v_gene} />
        </td>
        <td>
          <GeneCollapser gene={cloneInfo.clone.j_gene} />
        </td>
        <td>{cloneInfo.clone.cdr3_num_nts}</td>
        <td className="text-mono sequence">{colorAAs(cloneInfo.clone.cdr3_aa)}</td>
        <td>{numeral(cloneInfo.unique_sequences).format('0,0')}</td>
        <td>{numeral(cloneInfo.total_sequences).format('0,0')}</td>
        <td>
          <a onClick={this.expand.bind(this, cloneInfo.clone.id)}>
            {cloneInfo.selected_samples.length}{cloneInfo.other_samples.length > 0 ? ' +' + cloneInfo.other_samples.length : ''}
          </a>
        </td>
      </tr>
    ];
    if (_.includes(this.state.expanded, cloneInfo.clone.id)) {
      rows.push(
        <tr key={cloneInfo.clone.id + '_stats'}>
          <td></td>
          <td colSpan="8">
            <div className="ui red segment">
              <h4>Sample Breakdown</h4>
              <table className="ui compact table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Unique Seqs.</th>
                    <th>Total Seqs.</th>
                  </tr>
                </thead>
                <tbody>
                  {_.map(cloneInfo.selected_samples, (stat) => {
                    return (
                      <tr key={stat.id}>
                        <td>{stat.id}</td>
                        <td><Link to={'/sample/' + stat.id}>{stat.name}</Link></td>
                        <td>{numeral(stat.unique_sequences).format('0,0')}</td>
                        <td>{numeral(stat.total_sequences).format('0,0')}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </td>
        </tr>
      );
    }
    return rows;
  }

  render() {
    if (this.state.asyncState == 'loading') {
      return <Message type='' icon='notched circle loading' header='Loading'
              message='Gathering clone information' />;
    } else if (this.state.asyncState == 'error') {
      return <Message type='error' icon='warning sign' header='Error'
              message='Unable to fetch clone information' />;
    }

    return (
      <div className="ui segment teal">
        <h4>Clone Overlaps (page {this.state.page})</h4>
        <table className="ui table">
          <thead>
            <tr>
              <th>ID<i className="help icon popup" data-title="ID"
                data-content="The unique identifier for the clone"></i></th>
              <th>Subject<i className="help icon popup" data-title="Subject"
                data-content="The subject from which the clone originated"></i></th>
              <th>V Gene <i className="help icon popup" data-title="V Gene"
                data-content="The variable gene associated with the clone"></i></th>
              <th>J Gene <i className="help icon popup" data-title="J Gene"
                data-content="The joining gene associated with the clone"></i></th>
              <th>CDR3 Length <i className="help icon popup" data-title="CDR3 Length"
                data-content="The length of the CDR3 in nucleotides"></i></th>
              <th>CDR3 AA <i className="help icon popup" data-title="CDR3 AA"
                data-content="The amino acids in the CDR3"></i></th>
              <th>Unique Seqs. <i className="help icon popup" data-title="Unique Sequences"
                data-content="The total number of unique sequences from the subject in this clone"></i></th>
              <th>Total Seqs. <i className="help icon popup" data-title="Total Sequences"
                data-content="The total number of sequences in this clone"></i></th>
              <th>Samples Present<i className="help icon popup" data-title="Samples Present"
                data-content="The number of selected + other samples in which this clone appears"></i></th>
            </tr>
          </thead>
          <tbody>
            {_.map(this.state.clones, (clone) => {
              return this.getCloneRows(clone);
            })}
          </tbody>
        </table>

        <div className="ui one column stackable center aligned page grid">
          <div className="column twelve wide">
            <button className="ui labeled icon button" onClick={this.prevPage} disabled={this.state.page == 1 || this.state.asyncState != 'loaded'}>
              <i className="left chevron icon"></i>
              Previous
            </button>
            <button className="ui right labeled icon button" onClick={this.nextPage} disabled={this.state.asyncState != 'loaded'}>
              Next
              <i className="right chevron icon"></i>
            </button>
          </div>
        </div>
      </div>
    );
  }
}
