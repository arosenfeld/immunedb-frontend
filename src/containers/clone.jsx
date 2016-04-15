import numeral from 'numeral';

import React from 'react';

import API from '../api';
import Message from '../components/message';

import CloneSequenceList from '../components/cloneSequences';
import MutationsView from '../components/cloneMutations';
import CloneLineage from '../components/cloneLineage';
import OverlapList from '../components/cloneOverlap';
import SelectionPressure from '../components/clonePressure';
import SequenceCompare from '../components/cloneSequenceCompare';

import { colorAAs, colorNTs, optional } from '../utils';

export default class Clone extends React.Component {
  constructor() {
    super();
    this.state = {
      asyncState: 'loading',
      cloneInfo: {}
    };
  }

  componentDidMount() {
    this.setState({ asyncState: 'loading' });
    API.post('clone/' + this.props.params.id).end((err, response) => {
      if (err) {
        this.setState({ asyncState: 'error' });
      } else {
        this.setState({
          asyncState: 'loaded',
          cloneInfo: response.body
        });
      }
    });
  }

  componentDidUpdate() {
    $('.popup').popup({
      position: 'bottom left'
    });
  }

  render() {
    if (this.state.asyncState == 'loading') {
      return <Message type='' icon='notched circle loading' header='Loading'
              message='Gathering clone information' />;
    } else if (this.state.asyncState == 'error' || !this.state.cloneInfo) {
      return <Message type='error' icon='warning sign' header='Error'
              message='Unable to fetch clone information' />;
    }

    return (
      <div>
        <h1>
          Clone #{this.state.cloneInfo.clone.id}
					<a className="ui labeled icon button right floated teal"
             href={'export/sequences/clone/' + this.state.cloneInfo.clone.id}>
						<i className="download icon"></i>
						Download Sequences
					</a>
        </h1>
        <table className="ui structured teal table">
          <thead>
            <tr>
              <th colSpan="7">General</th>
            </tr>
          </thead>
          <tbody>
            <tr className="active">
              <td>ID</td>
              <td>V Gene</td>
              <td>J Gene</td>
              <td>CDR3 Length</td>
              <td>CDR3 Amino-acids</td>
              <td>Unique Seqs.</td>
              <td>Total Seqs.</td>
            </tr>
            <tr>
              <td>{this.state.cloneInfo.clone.id}</td>
              <td>{this.state.cloneInfo.clone.v_gene}</td>
              <td>{this.state.cloneInfo.clone.j_gene}</td>
              <td>{this.state.cloneInfo.clone.cdr3_nt.length}</td>
              <td className="text-mono sequence">{colorAAs(this.state.cloneInfo.clone.cdr3_aa)}</td>
              <td>{numeral(this.state.cloneInfo.samples.all.unique).format('0,0')}</td>
              <td>{numeral(this.state.cloneInfo.samples.all.total).format('0,0')}</td>
            </tr>
          </tbody>
        </table>

        <OverlapList samples={this.state.cloneInfo.samples.single} />
        <CloneSequenceList cloneId={this.state.cloneInfo.clone.id} />
        <SelectionPressure cloneId={this.state.cloneInfo.clone.id} />
        <MutationsView cloneId={this.state.cloneInfo.clone.id} />
        <SequenceCompare clone={this.state.cloneInfo.clone} mutationStats={this.state.cloneInfo.mutation_stats} />
        <CloneLineage cloneId={this.state.cloneInfo.clone.id} />
      </div>
    );
  }
}

export default Clone;
