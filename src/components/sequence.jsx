import numeral from 'numeral';

import React from 'react';
import connectToStores from 'alt/utils/connectToStores';

import { Link } from 'react-router';

import Message from './message';

import SequenceActions from '../actions/sequences';
import SequenceStore from '../stores/sequences';

import GeneCollapser from './geneCollapser';
import { colorAAs, colorNTs, optional } from '../utils';

export default class Sequence extends React.Component {
  static getStores() {
    return [SequenceStore];
  }

  static getPropsFromStores() {
    return SequenceStore.getState();
  }

  constructor() {
    super();
  }

  componentDidMount() {
    SequenceActions.getSequence(this.props.params.sampleId, this.props.params.seqId);
  }

  render() {
    if (this.props.asyncState == 'loading') {
      return <Message type='' icon='notched circle loading' header='Loading'
              message='Gathering sequence information' />;
    } else if (this.props.asyncState == 'error' || !this.props.sequences || this.props.sequences.length != 1) {
      return <Message type='error' icon='warning sign' header='Error'
              message='Unable to fetch sequence information' />;
    }

    let sequence = this.props.sequences[0];
    return (
      <div>
        <h1>Sequence {sequence.seq_id}</h1>
        <table className="ui structured teal table">
          <thead>
            <tr>
              <th colSpan="4">General</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Sequence ID</strong></td>
              <td>{sequence.seq_id}</td>
              <td><strong>Copy Number</strong></td>
              <td>{numeral(sequence.copy_number).format('0,0')}</td>
            </tr>
            <tr>
              <td><strong>Functional</strong></td>
              <td>{sequence.functional ? 'Yes' : 'No'}</td>
              <td><strong>Stop</strong></td>
              <td>{sequence.stop ? 'Yes' : 'No'}</td>
            </tr>
            <tr>
              <td><strong>In-frame</strong></td>
              <td>{sequence.in_frame ? 'Yes' : 'No'}</td>
              <td><strong>Partial Read</strong></td>
              <td>{sequence.partial ? 'Yes' : 'No'}</td>
            </tr>
            <tr>
              <td><strong>Paired Read</strong></td>
              <td>{sequence.paired ? 'Yes' : 'No'}</td>
              <td></td>
              <td></td>
            </tr>
          </tbody>
        </table>

        <table className="ui teal table">
          <thead>
            <tr>
              <th colSpan="4">Sample</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Name</strong></td>
              <td><Link to={'/sample/' + sequence.sample.id}>{sequence.sample.name}</Link></td>
              <td><strong>Study</strong></td>
              <td>{sequence.sample.subject.study.name}</td>
            </tr>
            <tr>
              <td><strong>Date</strong></td>
              <td>{sequence.sample.date}</td>
              <td><strong>Subject</strong></td>
              <td><Link to={'/subject/' + sequence.sample.subject.id}>{sequence.sample.subject.identifier}</Link></td>
            </tr>
            <tr>
              <td><strong>Disease</strong></td>
              <td>{optional(sequence.sample.disease)}</td>
              <td><strong>Tissue</strong></td>
              <td>{optional(sequence.sample.tissue)}</td>
            </tr>
            <tr>
              <td><strong>Subset</strong></td>
              <td>{optional(sequence.sample.subset)}</td>
              <td><strong>Ig Class</strong></td>
              <td>{optional(sequence.sample.ig_class)}</td>
            </tr>
            <tr>
              <td><strong>V Primer</strong></td>
              <td>{optional(sequence.sample.v_primer)}</td>
              <td><strong>J Primer</strong></td>
              <td>{optional(sequence.sample.j_primer)}</td>
            </tr>
            <tr>
              <td><strong>Lab</strong></td>
              <td>{optional(sequence.sample.lab)} {sequence.sample.experimenter ? ' (' + sequence.sample.experimenter + ')' : ''}</td>
              <td></td>
              <td></td>
            </tr>
          </tbody>
        </table>

        <table className="ui teal table">
          <thead>
            <tr>
              <th colSpan="2">Collapse Information</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="collapsing"><strong>Representative Subject Sequence</strong></td>
              <td>
              {
                sequence.collapse_info.seq_id == sequence.seq_id ?
                  <i>Self</i>
                :
                [
                  <Link to={'/sequences/' + sequence.collapse_info.sample_id + '/' + sequence.collapse_info.seq_id} key="seq_link">
                    {sequence.collapse_info.seq_id}
                  </Link>,
                  <strong key="in">{' in sample '}</strong>,
                  <Link to={'/sample/' + sequence.collapse_info.sample_id} key="sample_link">{sequence.collapse_info.sample_name}</Link>
                ]
              }
              </td>
            </tr>
            <tr>
              <td><strong>Copy Number in Subject</strong></td>
              <td>{numeral(sequence.collapse_info.copy_number).format('0,0')}</td>
            </tr>
            <tr>
              <td><strong>Instances in Subject</strong></td>
              <td>{numeral(sequence.collapse_info.instances).format('0,0')}</td>
            </tr>
          </tbody>
        </table>

        <table className="ui teal table">
          <thead>
            <tr>
              <th colSpan="2">CDR3</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Length</strong></td>
              <td>{sequence.cdr3_nt.length} nucleotides / {_.floor(sequence.cdr3_nt.length / 3)} amino-acids
                {sequence.cdr3_nt.length % 3 != 0 ? <span className="faded"> (Out of frame)</span>: ''}
              </td>
            </tr>
            <tr>
              <td><strong>Nucleotides</strong></td>
              <td className="text-mono sequence">{colorNTs(sequence.cdr3_nt)}</td>
            </tr>
            <tr>
              <td><strong>Amino-acids</strong></td>
              <td className="text-mono sequence">{colorAAs(sequence.cdr3_aa)}</td>
            </tr>
          </tbody>
        </table>

        <table className="ui teal table">
          <thead>
            <tr>
              <th colSpan="2">Variable Gene</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Name</strong></td>
              <td><GeneCollapser gene={sequence.v_gene} /></td>
            </tr>
            <tr>
              <td><strong>Padding</strong></td>
              <td>{sequence.pad_length}</td>
            </tr>
            <tr>
              <td className="collapsing"><strong>Length (w/o IMGT gaps)</strong></td>
              <td>{sequence.v_length}</td>
            </tr>
            <tr>
              <td><strong>Match</strong></td>
              <td>
                {sequence.v_match}
                <span className="faded">{' (' + numeral(sequence.v_match / sequence.v_length).format('0,0%') + ')'}</span>
              </td>
            </tr>
          </tbody>
        </table>

        <table className="ui teal table">
          <thead>
            <tr>
              <th colSpan="2">Joining Gene</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Name</strong></td>
              <td><GeneCollapser gene={sequence.j_gene} /></td>
            </tr>
            <tr>
              <td className="collapsing"><strong>Length (w/o IMGT gaps)</strong></td>
              <td>{sequence.j_length}</td>
            </tr>
            <tr>
              <td><strong>Match</strong></td>
              <td>
                {sequence.j_match}
                <span className="faded">{' (' + numeral(sequence.j_match / sequence.j_length).format('0,0%') + ')'}</span>
              </td>
            </tr>
          </tbody>
        </table>

        {sequence.clone ?
          <table className="ui teal table">
            <thead>
              <tr>
                <th colSpan="2">Clone</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>ID</strong></td>
                <td><Link to={'/clone/' + sequence.clone.id}>{sequence.clone.id}</Link></td>
              </tr>
              <tr>
                <td><strong>Consensus CDR3 Nucleotides</strong></td>
                <td className="text-mono sequence">{colorNTs(sequence.clone.cdr3_nt)}</td>
              </tr>
              <tr>
                <td><strong>Consensus CDR3 Amino-acids</strong></td>
                <td className="text-mono sequence">{colorAAs(sequence.clone.cdr3_aa)}</td>
              </tr>
            </tbody>
          </table>
        :
					<div className="ui message">
						<div className="header">
            Sequence is not associated with a clone
						</div>
						<p>This sequence has not been assigned a clone either because clonal assignment has not been run or it
               does not meet the specified criteria.</p>
					</div>
        }
      </div>
    );
  }
}

export default connectToStores(Sequence);
