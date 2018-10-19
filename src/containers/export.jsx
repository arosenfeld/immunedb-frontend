import React from 'react';
import {Link} from 'react-router';

import queryString from 'query-string';

import API from '../api';
import {ENDPOINT} from '../api';
import Message from '../components/message';
import {getMetadataFields} from '../utils';

class DownloadButton extends React.Component {
  render() {
    return (
      <Link className="ui primary button"
        to={{
          pathname: 'download',
          state: {
            endpoint: ENDPOINT + '/' + this.props.path + '?' +
              queryString.stringify(this.props.state)
          }
        }}>
        Download
      </Link>
    );
  }
}

class ExportFormat extends React.Component {
  constructor(props) {
    super();
  }

  handleInputChange = (event) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({[name]: value});
  }

  handleSubmit = (event) => {
    event.preventDefault();
  }
}

function metaPoolHandler() {
  $('#poolOnMeta').hide();
  $('.dropdown').dropdown({
    onChange: (value, text, $selectedItem) => {
      if (typeof($selectedItem) == 'string') {
        var name = 'pool_on_meta';
      } else {
        var name = $selectedItem.parent().parent().find('select').attr('name');
      }
      this.setState({
        [name]: value
      }, () => {
        if (this.state.pool_on == 'metadata') {
          $('#poolOnMeta').show();
        } else {
          $('#poolOnMeta').hide();
        }
      })
    }
  });
}

class ExportClones extends ExportFormat {
  constructor() {
    super();
    this.state = {
      format: 'immunedb',
      pool_on: 'sample',
      pool_on_meta: []
    }
    this.componentDidMount = metaPoolHandler.bind(this);
  }

  getVars = () => {
    return {
        format: this.state.format,
        samples: this.props.samples,
        pool_on: this.state.pool_on == 'metadata' ? this.state.pool_on_meta.join(',') :
          this.state.pool_on,
    };
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <div className="content">
          <div className="ui fluid form">
            <div className="two fields">
              <div className="field">
                <label>Format</label>
                <select className="ui dropdown" name="format"
                        value={this.state.format} onChange={this.handleInputChange}>
                  <option value="immunedb">ImmuneDB</option>
                  <option value="vdjtools">VDJTools</option>
                </select>
              </div>

              <div className="field">
                <label>Pool On</label>

                <select className="ui fluid dropdown" name="pool_on">
                  <option value="sample">Sample</option>
                  <option value="subject">Subject</option>
                  <option value="metadata">Metadata</option>
                </select>
              </div>
            </div>


            <div className="two fields">
              <div className="field"></div>
              <div className="field" id="poolOnMeta">
                <label>Metadata fields</label>

                <select className="ui multiple selection dropdown" multiple name="pool_on_meta">
                  <option value="">Metadata</option>
                  {_.map(this.props.metadata, m =>
                    <option value={m} key={m}>{m}</option>
                  )}
                </select>

              </div>
            </div>

          </div>
          <div className="field">
            <DownloadButton path="export/clones" state={this.getVars()} />
          </div>
        </div>
      </form>
    );

  }
}

class ExportOverlap extends ExportFormat {
  constructor() {
    super();
    this.state = {
      pool_on: 'sample',
      pool_on_meta: [],
      sim_func: 'cosine',
      size_metric: 'copies',
      agg_func: 'median',
    }

    this.componentDidMount = metaPoolHandler.bind(this);
  }

  getVars = () => {
    return Object.assign(
      _.pick(this.state, ['sim_func', 'size_metric', 'agg_func']), {
        samples: this.props.samples,
        pool_on: this.state.pool_on == 'metadata' ? this.state.pool_on_meta.join(',') :
          this.state.pool_on,
      }
    );
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <div className="content">
          <div className="ui fluid form">


            <div className="three fields">
              <div className="field">
                <label>Similarity Function</label>

                <select className="ui dropdown" name="sim_func">
                  <option value="cosine">Cosine</option>
                  <option value="jaccard">Jaccard</option>
                </select>
              </div>

              <div className="field">
                <label>Clone Size Metric</label>

                <select className="ui dropdown" name="size_metric">
                  <option value="copies">Copies</option>
                  <option value="instances">Instances</option>
                </select>
              </div>

              <div className="field">
                <label>Aggregation Function</label>

                <select className="ui dropdown" name="agg_func">
                  <option value="median">Median</option>
                  <option value="mean">Mean</option>
                </select>
              </div>

            </div>

            <div className="two fields">
              <div className="field">
                <label>Pool On</label>

                <select className="ui fluid dropdown" name="pool_on">
                  <option value="sample">Sample</option>
                  <option value="subject">Subject</option>
                  <option value="metadata">Metadata</option>
                </select>
              </div>

              <div className="field" id="poolOnMeta">
                <label>Metadata fields</label>

                <select className="ui multiple selection dropdown" multiple name="pool_on_meta">
                  <option value="">Metadata</option>
                  {_.map(this.props.metadata, m =>
                    <option value={m} key={m}>{m}</option>
                  )}
                </select>
              </div>
            </div>
          </div>

          <div className="field">
            <DownloadButton path="export/overlap" state={this.getVars()} />
          </div>
        </div>
      </form>
    );

  }
}

class ExportSequences extends ExportFormat {
  constructor() {
    super();
    this.state = {
      min_subject_copies: 2,
      clones_only: true,
      format: 'changeo',
    }
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <div className="content">
          <div className="ui fluid form">
            <div className="two fields">
              <div className="field">
                <label>Format</label>
                <select className="ui dropdown" name="format"
                        value={this.state.format} onChange={this.handleInputChange}>
                  <option value="changeo">Change-O</option>
                  <option value="airr">AIRR</option>
                </select>
              </div>
              <div className="field">
                <label>Min. Copies in Subject</label>
                <input type="number" name="min_subject_copies"
                       value={this.state.min_subject_copies} onChange={this.handleInputChange} />
              </div>
            </div>
          </div>
          <div className="ui segment">
            <div className="field">
              <div className="ui toggle checkbox">
                <input type="checkbox" name="clones_only" tabIndex="0"
                       checked={this.state.clones_only} onChange={this.handleInputChange} />
                <label>Include only clonal sequences</label>
              </div>
            </div>
          </div>
          <div className="field">
            <DownloadButton path="export/sequences" state={_.assign({}, this.state, {
              'samples': this.props.samples})} />
          </div>
        </div>
      </form>
    );
  }
}

class ExportSamples extends ExportFormat {
  constructor() {
    super();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <div className="content">
          <div className="ui fluid form">
            <div className="field">
              <DownloadButton path="export/samples" state={{samples: this.props.samples}} />
            </div>
          </div>
        </div>
      </form>
    );
  }
}

class ExportSelection extends ExportFormat {
  constructor() {
    super();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <div className="content">
          <div className="ui warning message">
            <p><strong>Note:</strong> Data will only be downloaded if selection
              pressure has been pre-calculated.</p>
          </div>
          <div className="ui fluid form">
            <div className="field">
              <DownloadButton path="export/selection" state={{samples: this.props.samples}} />
            </div>
          </div>
        </div>
      </form>
    );
  }
}

export default class Export extends React.Component {
  constructor() {
    super();
    this.state = {
      samples: [],
      asyncState: 'loading',
      form: null
    };
  }

  componentDidMount() {
    this.setState({asyncState: 'loading'});
    API.post('samples/list/' + this.props.params.sampleEncoding).end((err, response) => {
      if (err) {
        this.setState({asyncState: 'error'});
      } else {
        this.setState({
          asyncState: 'loaded',
          samples: response.body,
          metadata: getMetadataFields(response.body)
        });
      }
    });
  }

  setForm = (form) => {
    this.setState({form});
  }

  getForm = () => {
    let props = {
      samples: this.props.params.sampleEncoding,
      metadata: this.state.metadata
    };
    return {
      null: '',
      'clones': <ExportClones {...props} />,
      'sequences': <ExportSequences {...props} />,
      'overlap': <ExportOverlap {...props} />,
      'samples': <ExportSamples {...props} />,
      'selection': <ExportSelection {...props} />
    }[this.state.form];
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
        <h1>Custom Analysis</h1>
        <div className="ui info message">
          <p>You have {_.size(this.state.samples)} selected samples for your
            analysis.  Only data from those samples will be included.</p>
        </div>
        <div className="ui teal segment">
          <h2>Please select an analysis type</h2>
          <div className="ui five item menu">
            {_.map(['Clones', 'Sequences', 'Samples', 'Overlap', 'Selection'], (f) => {
                return (
                  <a className={'item' + (f.toLowerCase() == this.state.form ? ' active' : '')}
                    key={f}
                    onClick={() => this.setForm(f.toLowerCase())}>
                    {f}
                  </a>
                );
            })}
          </div>
        </div>
        {this.getForm() ?
          <div className="ui teal segment">
            {this.getForm()}
          </div>
          : ''}
      </div>
    );
  }
}
