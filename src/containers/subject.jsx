import numeral from 'numeral';

import React from 'react';

import API from '../api';
import Message from '../components/message';
import SampleList from '../components/sampleList';
import SequenceList from '../components/sequenceList';

export default class Subject extends React.Component {
  constructor() {
    super();
    this.state = {
      asyncState: 'loading',
    };
  }

  componentDidMount() {
    this.update();
  }

  componentDidUpdate() {
    $('.popup').popup({
      position: 'bottom left'
    });
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

  update = () => {
    API.post('subject/' + this.props.params.id).end((err, response) => {
      if (err) {
        this.setState({asyncState: 'error'});
      } else {
        this.setState({
          subject: response.body,
          asyncState: 'loaded'
        }, this.updateClones);
      }
    });
  }

  updateClones = () => {
  }

  render() {
    if (this.state.asyncState == 'loading') {
      return <Message type='' icon='notched circle loading' header='Loading'
              message='Gathering subject information' />;
    } else if (this.state.asyncState == 'error') {
      return <Message type='error' icon='warning sign' header='Error'
              message='Unable to fetch subject information' />;
    }

    return (
      <div>
        <h1>Subject {this.state.subject.identifier}</h1>
        <div className="ui teal segment">
          <h2>Samples</h2>
          <SampleList samples={this.state.subject.samples} />
        </div>
        <div className="ui teal segment">
          <h2>Sequences</h2>
          <SequenceList subjectId={this.state.subject.id} />
        </div>
      </div>
    );
  }
}

export default Subject;
