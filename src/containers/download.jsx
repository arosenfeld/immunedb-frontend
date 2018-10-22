import React from 'react';

import API from '../api';
import {ENDPOINT} from '../api';

export default class Download extends React.Component {
  constructor() {
    super();
    this.state = {
      asyncState: 'loading',
      complete: false,
      uid: null,
      log: ''
    };
  }

  getLog = () => {
    API.get('export/job_log/' + this.state.uid).then(res => {
      this.setState(res.body, () => {
        if (!this.state.complete) {
          _.defer(_.delay, this.getLog, 1000);
        }
      })
    });
  }

  componentDidMount() {
    this.setState({asyncState: 'loading'});
    API.get(this.props.location.state.endpoint).then(res => {
      this.setState({uid: res.body.uid}, () => {
        _.defer(this.getLog);
      });
    }).catch(err => {
        this.setState({asyncState: 'error'});
    });
  }

  render() {
    return (
      <div>
        <h1>Job Processing <span className="faded" style={{'float': 'right'}}>ID: {this.state.uid}</span></h1>
        <div className="ui teal segment">
          <h4 className="ui header">
            <div className="content">
              Job Log (last 25 lines only)
            </div>
          </h4>
          <div className="fakeScreen">
            <pre style={{margin: 0}}>
              <p className="term">
                {this.state.log ||
                  <span>
                    <i className="plug icon notched circle loading large"></i>
                    Starting Job...
                  </span>
                }
              </p>
            </pre>
          </div>
          {this.state.complete ?
            <div style={{textAlign: 'center', margin: '1em'}}>
              <a href={ENDPOINT + '/export/job/' + this.state.uid}
                 className={'ui large button positive'}>
                Download Result
              </a>
            </div>
          : ''}
        </div>
      </div>
    );
  }
}
