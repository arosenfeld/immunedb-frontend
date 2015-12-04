import numeral from 'numeral';

import React from 'react';

import { Link } from 'react-router';

import API from '../api';
import Message from './message';

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
          asyncState: 'loaded',
          subject: response.body
        });
      }
    });
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
        <h1>Subject</h1>
      </div>
    );
  }
}

export default Subject;
