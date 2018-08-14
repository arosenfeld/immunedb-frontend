import numeral from 'numeral';

import React from 'react';
import { Link } from 'react-router';

import API from '../api';
import Message from '../components/message';

import SubcloneList from '../components/cloneSubclones';
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

  sequenceCount = (type) => {
    let onlyClone = numeral(this.state.cloneInfo.clone['overall_' + type + '_cnt']).format('0,0');
    let subclones = this.state.cloneInfo.children.length > 0;
    if (subclones) {
      return (
        <span>
          {onlyClone + ' / '}
          {numeral(this.state.cloneInfo.clone['overall_' + type + '_cnt_with_subclones']).format('0,0')}
          <i className="help icon popup"
           data-content="Sequences in this clone / including subclones"></i>
        </span>
      );
    }
    return onlyClone;
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
        </h1>
        {this.state.cloneInfo.parent != null ?
					<div className="ui info message">
						<div className="header">
							This clone is a subclone
						</div>
            <p>Clone <Link to={'clone/' + this.state.cloneInfo.parent.id} target='_blank'>
              #{this.state.cloneInfo.parent.id}</Link> is likely the parent of this
            clone.  It shares the same V-gene, J-gene, and has a similar CDR3
            but has no insertions or deletions.</p>
					</div>
        : ''}
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
              <td>{this.sequenceCount('unique')}</td>
              <td>{this.sequenceCount('total')}</td>
            </tr>
          </tbody>
        </table>

        {this.state.cloneInfo.children.length > 0 ?
          <SubcloneList subclones={this.state.cloneInfo.children} />
         : ''}
        <OverlapList samples={this.state.cloneInfo.samples.single} />
        <CloneSequenceList cloneId={this.state.cloneInfo.clone.id} />
        <SelectionPressure cloneId={this.state.cloneInfo.clone.id} />
        <MutationsView cloneId={this.state.cloneInfo.clone.id} />
        <SequenceCompare clone={this.state.cloneInfo.clone} mutationStats={this.state.cloneInfo.mutation_stats} />
        <CloneLineage cloneId={this.state.cloneInfo.clone.id} samples={this.state.cloneInfo.samples.single} />
      </div>
    );
  }
}
