import React from 'react';

import {ENDPOINT} from '../api';

export default class SequenceExport extends React.Component {
  constructor() {
    super();
    this.state = {
      format: null,
      min_subject_copies: 2,
      clones_only: true
    };
  }

  componentDidMount() {
    $('#format-select').dropdown({
      action: 'hide',
      onChange: (value, text) => {
        this.setState({
          format: value
        }, this.doExport);
      }
    });
  }

  doExport = () => {
    $('#download-form').submit();
  }

  setMinCopies = (e) => {
    this.setState({
      min_subject_copies: e.target.value
    });
  }

  toggleClone = () => {
    this.setState({
      clones_only: !this.state.clones_only
    });
  }

  render() {
    return (
      <div>
        <h1>Export Sequences</h1>
        <div className="ui teal segment">
          <h4>Options</h4>
          <form method="GET" action={ENDPOINT + '/export/sequences/' + this.state.format}
                id="download-form" target="download-frame">
            <div className="ui form">
              <div className="field">
                <label>Only include sequences with at least a minimum number of copies in the subject</label>
                <input type="number" name="min_subject_copies"
                       onChange={this.setMinCopies}
                       defaultValue={this.state.min_subject_copies}
                       style={{ width: '8em' }} />
              </div>
              <div className="field">
                <div className="ui checkbox">
                  <input type="checkbox" name="clones_only" onChange={this.toggleClone} checked={this.state.clones_only} />
                  <label>Only include sequences assigned to a clone</label>
                </div>
              </div>

              <div id="format-select" className={'ui dropdown labeled icon primary button'}>
                <i className="file outline icon"></i>
                <div className="text">Export</div>
                <div className="menu">
                  <div className="item" data-value="changeo">Change-O</div>
                  <div className="item" data-value="changeo">AIRR</div>
                </div>
              </div>

            </div>
          </form>
          <iframe name="download-frame" style={{display: 'none'}}></iframe>
        </div>
      </div>
    );
  }
}
