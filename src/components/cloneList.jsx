import numeral from 'numeral';

import React from 'react';

import API from '../api';
import GeneCollapser from './geneCollapser';
import Message from './message';
import { colorAAs } from '../utils';

export default class CloneList extends React.Component {
  getCloneRows = (clone) => {
    let rows = [
      <tr key={clone.id + '_info'}>
        <td>{clone.id}</td>
        <td>{clone.subject.identifier}</td>
        <td>
          <GeneCollapser gene={clone.v_gene} />
        </td>
        <td>
          <GeneCollapser gene={clone.j_gene} />
        </td>
        <td>{clone.cdr3_num_nts}</td>
        <td className="text-mono sequence">{colorAAs(clone.cdr3_aa)}</td>
        <td>{numeral(clone.unique_sequences).format('0,0')}</td>
        <td>{numeral(clone.total_sequences).format('0,0')}</td>
        <td>
          <a href={'clone/' + clone.id} target="_blank">
            View <i className="angle right icon"></i>
          </a>
        </td>
      </tr>,
      <tr key={clone.id + '_stats'}>
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
                {_.map(clone.stats, (stat) => {
                  return (
                    <tr key={stat.sample.id}>
                      <td>{stat.sample.id}</td>
                      <td><a href={'sample/' + stat.sample.id}>{stat.sample.name}</a></td>
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
    ];
    return rows;
  }

  render() {
    return (
      <table className="ui single line teal table">
        <thead>
          <tr>
            <th><a onClick={this.props.sort.bind(this, 'id')}>Clone ID</a> <i className="help icon popup" data-title="Clone ID"
              data-content="The unique identifier for the clone"></i></th>
            <th><a onClick={this.props.sort.bind(this, 'subject_id')}>Subject</a> <i className="help icon popup" data-title="Subject"
              data-content="The subject from which the clone originated"></i></th>
            <th><a onClick={this.props.sort.bind(this, 'v_gene')}>V Gene</a> <i className="help icon popup" data-title="V Gene"
              data-content="The variable gene associated with the clone"></i></th>
            <th><a onClick={this.props.sort.bind(this, 'j_gene')}>J Gene</a> <i className="help icon popup" data-title="J Gene"
              data-content="The joining gene associated with the clone"></i></th>
            <th><a onClick={this.props.sort.bind(this, 'cdr3_num_nts')}>CDR3 Length</a> <i className="help icon popup" data-title="CDR3 Length"
              data-content="The length of the CDR3 in nucleotides"></i></th>
            <th><a onClick={this.props.sort.bind(this, 'cdr3_aa')}>CDR3 AA</a> <i className="help icon popup" data-title="CDR3 AA"
              data-content="The amino acids in the CDR3"></i></th>
            <th><a onClick={this.props.sort.bind(this, 'unique_cnt')}>Unique Seqs.</a> <i className="help icon popup" data-title="Unique Sequences"
              data-content="The total number of unique sequences from the subject in this clone"></i></th>
            <th><a onClick={this.props.sort.bind(this, 'total_cnt')}>Total Seqs.</a> <i className="help icon popup" data-title="Total Sequences"
              data-content="The total number of sequences in this clone"></i></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {_.map(this.props.clones, (clone) => {
            return this.getCloneRows(clone);
          })}
        </tbody>
      </table>
    );
  }
}
