import numeral from 'numeral';

import React from 'react';
import connectToStores from 'alt/utils/connectToStores';

import { Link } from 'react-router';

import Message from './message';

import SequenceActions from '../actions/sequences';
import SequenceStore from '../stores/sequences';

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
        <table className="ui teal table">
          <thead>
            <tr>
              <th colSpan="2">General Information</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Sequence ID</strong></td>
              <td>{sequence.seq_id}</td>
            </tr>
            <tr>
              <td><strong>Sample</strong></td>
              <td><Link to={'/sample/' + sequence.sample.id}>{sequence.sample.name}</Link></td>
            </tr>
            <tr>
              <td><strong>Copy Number</strong></td>
              <td>{numeral(sequence.copy_number).format('0,0')}</td>
            </tr>
            <tr>
              <td><strong>Functional</strong></td>
              <td>{sequence.functional ? 'Yes' : 'No'}</td>
            </tr>
            <tr>
              <td><strong>Stop</strong></td>
              <td>{sequence.stop ? 'Yes' : 'No'}</td>
            </tr>
            <tr>
              <td><strong>In-frame</strong></td>
              <td>{sequence.in_frame ? 'Yes' : 'No'}</td>
            </tr>
            <tr>
              <td><strong>Partial Read</strong></td>
              <td>{sequence.partial ? 'Yes' : 'No'}</td>
            </tr>
            <tr>
              <td><strong>Paired Read</strong></td>
              <td>{sequence.paired ? 'Yes' : 'No'}</td>
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
              <td><strong>Representative Subject Sequence</strong></td>
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
              <td>{sequence.collapse_info.copy_number}</td>
            </tr>
            <tr>
              <td><strong>Instances in Subject</strong></td>
              <td>{sequence.collapse_info.instances}</td>
            </tr>
          </tbody>
        </table>

      </div>
    );
  }
}

export default connectToStores(Sequence);
