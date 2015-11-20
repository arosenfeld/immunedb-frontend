import React from 'react';

import API from '../api';
import Message from './message';

import SeqViewer from './seqViewer';

export default class SequenceCompare extends React.Component {
  constructor() {
    super();
    this.state = {
      asyncState: 'loading',
      page: 1,
      sequences: []
    };
  }

  componentDidMount() {
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
    API.post('clone/sequences/' + this.props.clone.id, {get_collapse: false, page: this.state.page}).end((err, response) => {
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

  render() {
    if (this.state.asyncState == 'loading') {
      return <Message type='' icon='notched circle loading' header='Loading'
              message='Gathering sequence information' />;
    } else if (this.state.asyncState == 'error' || !this.state.sequences || this.state.sequences.length == 0) {
      return <Message type='error' icon='warning sign' header='Error'
              message='Unable to fetch sequence information' />;
    }

    return (
      <div className="ui teal segment">
        <h4>Sequence View</h4>
        <SeqViewer seqs={this.state.sequences} germline={this.props.clone.germline} regions={this.props.clone.regions}
                   mutations={this.props.mutationStats} />
        <div className="ui basic segment center aligned">
          <button className="ui labeled icon button" onClick={this.prevPage} disabled={this.state.page == 1}>
            <i className="left chevron icon"></i>
            Previous
          </button>
          <button className="ui right labeled icon button" onClick={this.nextPage}>
            Next
            <i className="right chevron icon"></i>
          </button>
        </div>
      </div>
    );
  }
}


