import numeral from 'numeral';

import React from 'react';

import API from '../api';
import Message from './message';

export default class CloneSequenceList extends React.Component {
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
              <th colSpan="4">
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
              <th colSpan="4">
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
            <td className="active">Representative Sequence ID</td>
            <td className="active">Sample Name</td>
            <td className="active">Copy Number in Subject</td>
            <td className="active">Instances in Subject</td>
          </tr>
        {_.map(this.state.sequences, (sequence) => {
          return (
            [<tr key={sequence.seq_id}>
              <td><a href={'sequence/' + sequence.sample.id + '/' + sequence.seq_id}>{sequence.seq_id}</a></td>
              <td><a href={'sample/' + sequence.sample.id}>{sequence.sample.name}</a></td>
              <td>{numeral(sequence.copy_number_in_subject).format('0,0')}</td>
              <td>{numeral(sequence.instances_in_subject).format('0,0')}</td>
            </tr>,
            <tr>
              <td colSpan="4">
                <div className="ui red segment">
                  <h4>Sequence Collapsing to {sequence.seq_id}</h4>
                  <table className="ui table compact">
                    <thead>
                      <tr>
                        <th>Sequence ID</th>
                        <th>Sample Name</th>
                        <th>Copy Number in Sample</th>
                      </tr>
                    </thead>
                    <tbody>
                    {sequence.collapse_to.length > 0 ? _.map(sequence.collapse_to, (col) => {
                      return (
                        <tr key={col.seq_id}>
                          <td><a href={'sequence/' + col.sample_id + '/' + col.seq_id}>{col.seq_id}</a></td>
                          <td><a href={'sample/' + sequence.sample_id}>{col.sample_name}</a></td>
                          <td>{numeral(col.copy_number_in_sample).format('0,0')}</td>
                        </tr>
                      );
                    }) : <tr><td colSpan="3" className="center aligned">None</td></tr>}
                    </tbody>
                  </table>
                </div>
              </td>
            </tr>
            ]
          );
        })}
        <tr>
          <td colSpan="4" className="center aligned">
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
      <table className="ui table teal">
        <thead>
          <tr>
            <th colSpan="4">Unique Subject Sequences in Clone</th>
          </tr>
        </thead>
        {this.getBody()}
      </table>
    );
  }
}


