import React from 'react';

import ExportFields from '../components/exportFields';

import {ENDPOINT} from '../api';

export default class CloneExport extends React.Component {
  constructor() {
    super();
    this.state = {
      threshold: false
    };
  }

  doExport = () => {
    $('#download-form').submit();
  }

  threshold = (e) => {
    this.setState({
      threshold: e.target.checked
    });
  }

  componentDidUpdate() {
    $('select.dropdown').dropdown();
  }

  render() {
    return (
      <div>
        <h1>Export Clones</h1>
        <div className="ui teal segment">
          <h4>Options</h4>
          <form method="POST" action={ENDPOINT + '/export/mutations/' + this.props.params.type + '/' + this.props.params.encoding}
                id="download-form" target="download-frame">
            <div className="ui form">
              {this.props.params.type == 'sample' ?
                <div className="field">
                  <div className="ui checkbox">
                    <input type="checkbox" name="only_sample_rows"/>
                    <label>Limit mutations to only selected samples</label>
                  </div>
                </div>
              : ''}
              <div className="field">
                <div className="ui checkbox">
                  <input type="checkbox" onChange={this.threshold} checked={this.state.threshold}/>
                  <label>Threshold mutations</label>
                </div>
              </div>
              {this.state.threshold ?
                <div className="fields">
                  <div className="inline field">
                    <label>Export mutations appearing in at least</label>
                    <input type="number" min="0" defaultValue="0" name="thresh_value" />
                  </div>
                  <div className="inline field">
                    <select className="dropdown" name="type" name="thresh_type">
                      <option value="percent">percent of sequences</option>
                      <option value="sequences">sequences</option>
                    </select>
                  </div>
                </div>
              : ''
              }
            </div>
            <div className="field">
              <button className="ui labeled icon primary button">
                <i className="file outline icon"></i>
                Download
              </button>
            </div>
          </form>
          <iframe name="download-frame" style={{display: 'none'}}></iframe>
        </div>
      </div>
    );
  }
}
