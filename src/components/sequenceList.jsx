import numeral from 'numeral';
import lodash from 'lodash';

import React from 'react';
import connectToStores from 'alt/utils/connectToStores';

import API from '../api';
import Message from './message';
import SequenceActions from '../actions/sequences';
import SequenceStore from '../stores/sequences';

export default class SequenceList extends React.Component {
  static getStores() {
    return [SequenceStore];
  }

  static getPropsFromStores() {
    return SequenceStore.getState();
  }

  constructor() {
    super();
    SequenceActions.getAll();
  }
  render() {
    if (this.props.asyncState == 'loading') {
      return <Message type='' icon='notched circle loading' header='Loading'
              message='Gathering sample information' />;
    } else if (this.props.asyncState == 'error') {
      return <Message type='error' icon='warning sign' header='Error'
              message='Unable to fetch sample information' />;
    }

    return (
      <div>
        <table className="ui single line teal table">
          <thead>
            <tr>
              <th>Sequence ID</th>
              <th>Subject</th>
              <th>V Gene</th>
              <th>J Gene</th>
              <th>CDR3 Length</th>
              <th>CDR3 AA</th>
              <th>CDR3 Functional</th>
              <th>Copy Number</th>
              <th>Instances</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {_.map(this.props.sequences, (sequence) => {
              return (
                <tr>
                  <td>{sequence.seq_id}</td>
                  <td>{sequence.sample.subject.identifier}</td>
                  <td>{sequence.v_gene}</td>
                  <td>{sequence.j_gene}</td>
                  <td>{sequence.cdr3_num_nts}</td>
                  <td>{sequence.cdr3_aa}</td>
                  <td>{sequence.functional ? 'Yes' : 'No'}</td>
                  <td>{sequence.copy_number}</td>
                  <td>{sequence.instances}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }
}

export default connectToStores(SequenceList);
