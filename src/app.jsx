import 'style.css';

import React from 'react';

import Sidebar from './components/sidebar';
import AllSamples from './containers/allSamples';

export default class App extends React.Component {
  render() {
    return (
      <div>
        <Sidebar history={this.props.history} />
        <div className="ui container main"
             style={{width: '90%'}}>
          {this.props.children || <AllSamples />}
        </div>
      </div>
    );
  }
}
