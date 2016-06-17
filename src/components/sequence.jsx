import numeral from 'numeral';

import React from 'react';
import { Link } from 'react-router';

import API from '../api';
import Message from './message';
import SeqViewer from './seqViewer';
import { colorAAs, colorNTs, optional } from '../utils';

export default class Sequence extends React.Component {
  constructor() {
    super();
    this.state = {
      asyncState: 'loading',
      sequence: null
    };
  }

  componentDidMount() {
    this.setState({ asyncState: 'loading' });
    API.post('sequence/' + this.props.params.sampleId + '/' + this.props.params.seqId).end((err, response) => {
      if (err) {
        this.setState({ asyncState: 'error' });
      } else {
        this.setState({
          asyncState: 'loaded',
          sequence: response.body
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
              message='Gathering sequence information' />;
    } else if (this.state.asyncState == 'error' || !this.state.sequence) {
      return <Message type='error' icon='warning sign' header='Error'
              message='Unable to fetch sequence information' />;
    }

    return (
      <div>
        <h1>Sequence {this.state.sequence.seq_id}</h1>
        <table className="ui structured teal table">
          <thead>
            <tr>
              <th colSpan="4">General</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Sequence ID</strong></td>
              <td>{this.state.sequence.seq_id}</td>
              <td><strong>Copy Number</strong></td>
              <td>{numeral(this.state.sequence.copy_number).format('0,0')}</td>
            </tr>
            <tr>
              <td><strong>Functional</strong></td>
              <td>{this.state.sequence.functional ? 'Yes' : 'No'}</td>
              <td><strong>Stop</strong></td>
              <td>{this.state.sequence.stop ? 'Yes' : 'No'}</td>
            </tr>
            <tr>
              <td><strong>In-frame</strong></td>
              <td>{this.state.sequence.in_frame ? 'Yes' : 'No'}</td>
              <td><strong>Partial Read</strong></td>
              <td>{this.state.sequence.partial ? 'Yes' : 'No'}</td>
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
              <td>{this.state.sequence.sample.name}</td>
              <td><strong>Study</strong></td>
              <td>{this.state.sequence.sample.subject.study.name}</td>
            </tr>
            <tr>
              <td><strong>Date</strong></td>
              <td>{this.state.sequence.sample.date}</td>
              <td><strong>Subject</strong></td>
              <td><Link to={'subject/' + this.state.sequence.sample.subject.id}>{this.state.sequence.sample.subject.identifier}</Link></td>
            </tr>
            <tr>
              <td><strong>Disease</strong></td>
              <td>{optional(this.state.sequence.sample.disease)}</td>
              <td><strong>Tissue</strong></td>
              <td>{optional(this.state.sequence.sample.tissue)}</td>
            </tr>
            <tr>
              <td><strong>Subset</strong></td>
              <td>{optional(this.state.sequence.sample.subset)}</td>
              <td><strong>Ig Class</strong></td>
              <td>{optional(this.state.sequence.sample.ig_class)}</td>
            </tr>
            <tr>
              <td><strong>V Primer</strong></td>
              <td>{optional(this.state.sequence.sample.v_primer)}</td>
              <td><strong>J Primer</strong></td>
              <td>{optional(this.state.sequence.sample.j_primer)}</td>
            </tr>
            <tr>
              <td><strong>Lab</strong></td>
              <td>{optional(this.state.sequence.sample.lab)} {this.state.sequence.sample.experimenter ? ' (' + this.state.sequence.sample.experimenter + ')' : ''}</td>
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
          {this.state.sequence.collapse_info != null ?
            <tbody>
              <tr>
                <td className="collapsing"><strong>Representative Subject Sequence</strong></td>
                <td>
                {
                  this.state.sequence.collapse_info.seq_id == this.state.sequence.seq_id ?
                    <i>Self</i>
                  :
                  [
                    <Link to={'sequences/' + this.state.sequence.collapse_info.sample_id + '/' + this.state.sequence.collapse_info.seq_id} key="seq_link">
                      {this.state.sequence.collapse_info.seq_id}
                    </Link>,
                    <strong key="in">{' in sample '}</strong>,
                    this.state.sequence.collapse_info.sample_name
                  ]
                }
                </td>
              </tr>
              <tr>
                <td><strong>Copy Number in Subject</strong></td>
                <td>{numeral(this.state.sequence.collapse_info.copy_number).format('0,0')}</td>
              </tr>
              <tr>
                <td><strong>Instances in Subject</strong></td>
                <td>{numeral(this.state.sequence.collapse_info.instances).format('0,0')}</td>
              </tr>
            </tbody>
          :
            <tbody>
              <tr>
                <td colSpan="2">Sequence has not yet been collapsed.</td>
              </tr>
            </tbody>
          }
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
              <td>{this.state.sequence.cdr3_nt.length} nucleotides / {_.floor(this.state.sequence.cdr3_nt.length / 3)} amino-acids
                {this.state.sequence.cdr3_nt.length % 3 != 0 ? <span className="faded"> (Out of frame)</span>: ''}
              </td>
            </tr>
            <tr>
              <td><strong>Nucleotides</strong></td>
              <td className="text-mono sequence">{colorNTs(this.state.sequence.cdr3_nt)}</td>
            </tr>
            <tr>
              <td><strong>Amino-acids</strong></td>
              <td className="text-mono sequence">{colorAAs(this.state.sequence.cdr3_aa)}</td>
            </tr>
          </tbody>
        </table>

        <table className="ui teal table">
          <thead>
            <tr>
              <th>Gene</th>
              <th>Variable</th>
              <th>Joining</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Name</strong></td>
              <td>{this.state.sequence.v_gene}</td>
              <td>{this.state.sequence.j_gene}</td>
            </tr>
            <tr>
              <td className="collapsing"><strong>Length (w/o IMGT gaps)</strong></td>
              <td>{this.state.sequence.v_length}</td>
              <td>{this.state.sequence.j_length}</td>
            </tr>
            <tr>
              <td><strong>Match</strong></td>
              <td>
                {this.state.sequence.v_match}
                <span className="faded">{' (' + numeral(this.state.sequence.v_match / this.state.sequence.v_length).format('0,0%') + ')'}</span>
              </td>
              <td>
                {this.state.sequence.j_match}
                <span className="faded">{' (' + numeral(this.state.sequence.j_match / this.state.sequence.j_length).format('0,0%') + ')'}</span>
              </td>
            </tr>
            <tr>
              <td><strong>Padding</strong></td>
              <td>{this.state.sequence.pad_length}</td>
              <td><span className="faded">N/A</span></td>
            </tr>
          </tbody>
        </table>

        <div className="ui teal segment">
          <h4>Sequence View</h4>
          <SeqViewer seqs={[this.state.sequence]} germline={this.state.sequence.germline} regions={this.state.sequence.regions}
                     mutation_stats={this.state.sequence.mutations} />
        </div>

        {this.state.sequence.clone ?
          <table className="ui teal table">
            <thead>
              <tr>
                <th colSpan="2">Clone</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>ID</strong></td>
                <td><Link to={'clone/' + this.state.sequence.clone.id}>{this.state.sequence.clone.id}</Link></td>
              </tr>
              <tr>
                <td><strong>Consensus CDR3 Nucleotides</strong></td>
                <td className="text-mono sequence">{colorNTs(this.state.sequence.clone.cdr3_nt)}</td>
              </tr>
              <tr>
                <td><strong>Consensus CDR3 Amino-acids</strong></td>
                <td className="text-mono sequence">{colorAAs(this.state.sequence.clone.cdr3_aa)}</td>
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

export default Sequence;
