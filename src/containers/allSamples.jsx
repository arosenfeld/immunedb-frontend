import 'semantic-ui-css/semantic.css';
import 'semantic-ui-css/semantic.js';

import numeral from 'numeral';
import lodash from 'lodash';

import React from 'react';

import API from '../api';
import SampleList from '../components/sampleList';
import Message from '../components/message';

export default class AllSamples extends React.Component {
  constructor() {
    super();
    this.state = {
      samples: [],
      asyncState: 'loading',
    };
  }

  componentDidMount() {
    this.setState({asyncState: 'loading'});
    API.post('samples/list').end((err, response) => {
      if (err) {
        this.setState({asyncState: 'error'});
      } else {
        this.setState({
          asyncState: 'loaded',
          samples: response.body
        });
      }
    });
  }

  render() {
    if (this.state.asyncState == 'loading') {
      return <Message type='' icon='notched circle loading' header='Loading'
              message='Gathering sample information' />;
    } else if (this.state.asyncState == 'error') {
      return <Message type='error' icon='warning sign' header='Error'
              message='Unable to fetch sample information' />;
    }

    return (
      <div>
        <h1>Samples</h1>
        <SampleList samples={this.state.samples} />
      </div>
    );
  }
}
