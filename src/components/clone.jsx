import numeral from 'numeral';

import React from 'react';
import connectToStores from 'alt/utils/connectToStores';

import { Link } from 'react-router';
import API from '../api';
import Message from './message';

import CloneActions from '../actions/clones';
import CloneStore from '../stores/clones';

import SequenceActions from '../actions/sequences';
import SequenceStore from '../stores/sequences';

import SeqViewer from './seqViewer';
import GeneCollapser from './geneCollapser';
import { colorAAs, colorNTs, optional } from '../utils';

class OverlapList extends React.Component {
  constructor() {
    super();
    this.state = {
      show: false
    };
  }

  show = () => {
    this.setState({show: true});
  }

  getBody = () => {
    if (this.state.show) {
      return (
        <tbody>
          <tr className="active">
            <td>ID</td>
            <td>Name</td>
            <td>Tissue</td>
            <td>Subset</td>
            <td>Ig Class</td>
            <td>V Primer</td>
            <td>J Primer</td>
            <td>Unique Seqs.</td>
            <td>Total Seqs.</td>
          </tr>
          {_.map(this.props.samples, (sample) => {
            return (
              <tr key={sample.id}>
                <td>{sample.id}</td>
                <td><Link to={'/sample/' + sample.id}>{sample.name}</Link></td>
                <td>{optional(sample.tissue)}</td>
                <td>{optional(sample.subset)}</td>
                <td>{optional(sample.ig_class)}</td>
                <td>{optional(sample.v_primer)}</td>
                <td>{optional(sample.j_primer)}</td>
                <td>{numeral(sample.unique).format('0,0')}</td>
                <td>{numeral(sample.total).format('0,0')}</td>
              </tr>
            );
          })}
        </tbody>
      );
    }
    return (
      <tbody>
        <tr>
          <td colSpan="9" className="center aligned">
            <div className="ui labeled button" tabIndex="0" onClick={this.show}>
              <div className="ui button">
                <i className="level down icon"></i> Show Samples
              </div>
              <a className="ui basic left pointing label">
                {this.props.samples.length}
              </a>
            </div>
          </td>
        </tr>
      </tbody>
    );
  }

  render() {
    return (
      <table className="ui structured teal table">
        <thead>
          <tr>
            <th colSpan="9">Samples</th>
          </tr>
        </thead>
        {this.getBody()}
      </table>
    );
  };
}

class SequenceList extends React.Component {
  constructor() {
    super();
    this.state = {
      asyncState: 'loading',
      show: false,
      page: 1,
      sequences: []
    };
  }

  show = () => {
    this.setState({show: true});
    this.update();
  }

  nextPage = () => {
    this.setState({
      page: this.state.page + 1
    }, this.update);
  }

  prevPage = () => {
    this.setState({
      page: Math.max(0, this.state.page - 1)
    }, this.update);
  }

  update() {
    this.setState({
      asyncState: 'loading'
    });
    API.post('clone/sequences/' + this.props.cloneId, {get_collapse: true, page: this.state.page}).end((err, response) => {
      if (err) {
        this.setState({
          asyncState: 'error'
        });
      } else {
        this.setState({
          sequences: response.body,
          asyncState: 'loaded'
        });
      }
    });
  }

  getBody = () => {
    if (this.state.show) {
      if (this.state.asyncState == 'loading') {
        return (
          <tbody>
            <tr>
              <th colSpan="3">
                <Message type='' icon='notched circle loading' header='Loading'
                  message='Gathering sequence information' />
              </th>
            </tr>
          </tbody>
        );
      } else if (this.state.asyncState == 'error' || !this.state.sequences || this.state.sequences.length == 0) {
        return (
          <tbody>
            <tr>
              <th colSpan="3">
                <Message type='error' icon='warning sign' header='Error'
                  message='Unable to fetch sequence information' />;
              </th>
            </tr>
          </tbody>
        );
      }

      return (
        <tbody>
          <tr>
            <td className="active">Sample Name</td>
            <td className="active">Representative Sequence ID</td>
            <td className="active">Copy Number in Subject</td>
          </tr>
        {_.map(this.state.sequences, (sequence) => {
          return (
            <tr key={sequence.seq_id}>
              <td><Link to={'/sample/' + sequence.sample.id}>{sequence.sample.name}</Link></td>
              <td><Link to={'/sequence/' + sequence.sample.id + '/' + sequence.seq_id}>{sequence.seq_id}</Link></td>
              <td>{numeral(sequence.copy_number_in_subject).format('0,0')}</td>
            </tr>
          );
        })}
        <tr>
          <td colSpan="3" className="center aligned">
            <button className="ui labeled icon button" onClick={this.prevPage}
                disabled={this.state.page == 1 || this.state.asyncState == 'loading'}>
              <i className="left chevron icon"></i>
              Previous
            </button>
            <button className="ui right labeled icon button" onClick={this.nextPage}
                disabled={this.state.asyncState == 'loading'}>
              Next
              <i className="right chevron icon"></i>
            </button>
          </td>
        </tr>
        </tbody>
      );
    }

    return (
      <tbody>
        <tr>
          <td colSpan="9" className="center aligned" onClick={this.show}>
            <button className="ui labeled icon button">
              <i className="level down icon"></i>
              Show Sequences
            </button>
          </td>
        </tr>
      </tbody>
    );
  }

  render() {
    return (
      <table className="ui table">
        <thead>
          <tr>
            <th colSpan="3">Unique Subject Sequence in Clone</th>
          </tr>
        </thead>
        {this.getBody()}
      </table>
    );
  }
}

export default class Clone extends React.Component {
  static getStores() {
    return [CloneStore];
  }

  static getPropsFromStores() {
    return CloneStore.getState()
  }

  componentDidMount() {
    CloneActions.getClone(this.props.params.id);
  }

  render() {
    if (this.props.asyncState == 'loading') {
      return <Message type='' icon='notched circle loading' header='Loading'
              message='Gathering clone information' />;
    } else if (this.props.asyncState == 'error' || !this.props.clones || this.props.clones.length != 1) {
      return <Message type='error' icon='warning sign' header='Error'
              message='Unable to fetch clone information' />;
    }

    let info = this.props.clones[0];
    console.log(info);
    return (
      <div>
        <h1>Clone #{info.clone.id}</h1>
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
              <td>{info.clone.id}</td>
              <td><GeneCollapser gene={info.clone.v_gene} /></td>
              <td><GeneCollapser gene={info.clone.j_gene} /></td>
              <td>{info.clone.cdr3_nt.length}</td>
              <td className="text-mono sequence">{colorAAs(info.clone.cdr3_aa)}</td>
              <td>{numeral(info.samples.all.unique).format('0,0')}</td>
              <td>{numeral(info.samples.all.total).format('0,0')}</td>
            </tr>
          </tbody>
        </table>

        <OverlapList samples={info.samples.single} />
        <SequenceList cloneId={info.clone.id} />
      </div>
    );
  }
}

export default connectToStores(Clone);
