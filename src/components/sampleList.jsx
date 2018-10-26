import numeral from 'numeral';
import lodash from 'lodash';

import React from 'react';
import {Link} from 'react-router';

import API from '../api';
import Message from './message';

import {ENDPOINT} from '../api';
import {getMetadataFields} from '../utils';

export default class SampleList extends React.Component {
  constructor() {
    super();
    this.state = {
      selected: [],
      groupBy: ['subject.identifier']
    };
  }

  componentDidMount() {
    $('#grouping-dropdown').dropdown({
      onChange: (value, text) => {
        value = value.length ? value.split(',') : ['subject.identifier'];
        this.setState({
          groupBy: value
        });
      }
    });
  }

  toggleAll = (e) => {
    if (e.target.checked) {
      this.setState({
        selected: _.map(this.props.samples, s => s.id)
      });
    } else {
      this.setState({
        selected: []
      });
    }
  }

  toggleGroup = (e) => {
    let samples = _.map(
      _.filter(this.props.samples, s => _.get(s, this.state.groupBy) == e.target.value),
      'id'
    );
    let selected = this.state.selected.slice();
    _.each(samples, (s) => {
      if (e.target.checked) {
        selected = _.union(selected, [s]);
      } else {
        _.remove(selected, (other) => other === s);
      }
    });
    this.setState({
      selected
    });
  }

  toggle = (e) => {
    let selected = this.state.selected.slice();
    if (e.target.checked) {
      selected = _.union(selected, [parseInt(e.target.value)]);
    } else {
      _.remove(selected, (s) => s === parseInt(e.target.value));
    }

    this.setState({
      selected
    });
  }

  getEncoding = () => {
    let bitmap = _.map(
      _.range(1, _.max(this.state.selected) + 1),
      (value) => _.includes(this.state.selected, value) ? 'T' : 'F'
    );

    // Run-length encode the selection
    let last = bitmap[0];
    let count = 0;
    let encoding = [bitmap[0]];
    _.each(bitmap, (value) => {
      if (value == last) {
        count += 1;
      } else {
        encoding.push(count);
        encoding.push(value);
        count = 1;
      }
      last = value;
    });
    encoding.push(count);
    return encoding.join('');
  }

  redirect = (path) => {
    window.open(path + this.getEncoding());
  }

  getPooledEndpoint = (m) => {
    return ENDPOINT + '/export/clones/pooled?feature=' + m + '&samples=' + this.getEncoding();
  }

  getSampleGroup = (sample) => {
    let grp = _.map(this.state.groupBy, s => _.get(sample, s));
    return grp;
  }

  render() {
    let sampleHierarchy = _.groupBy(this.props.samples, s => s.subject.study.name);
    sampleHierarchy = _.mapValues(sampleHierarchy,
      (studySamples) => _.groupBy(studySamples, s => this.getSampleGroup(s))
    );

    let finalElements = [];
    _.forIn(sampleHierarchy, (samplesByCategory, study) => {
      finalElements.push(
        <h3 key={study + '_header'} className="ui header">
          {study}
          <div className="sub header">{_.sumBy(_.values(samplesByCategory), (e) => e.length)} samples in {_.keys(samplesByCategory).length} groups</div>
        </h3>
      );

      let dateRows = [];
      finalElements.push(
        <table className="ui single line teal table compact" key={study}>
          <thead>
            <tr>
              <th>
                <div className="ui fitted checkbox">
                  <input type="checkbox" onChange={this.toggleAll} /> <label></label>
                </div>
              </th>
              <th>#</th>
              <th>Name</th>
              <th>Input Seqs.</th>
              <th>Identifiable Seqs.</th>
              <th>Functional Seqs.</th>
              <th>Clones</th>
              <th>Functional Clones</th>
            </tr>
          </thead>
          <tbody>
            {_.map(_.keys(samplesByCategory), (key) => {
              let keyRows = []
                keyRows.push(
                  <tr className="active">
                    <td>
                      <div className="ui fitted checkbox">
                        <input type="checkbox" value={key} onChange={this.toggleGroup} /> <label></label>
                      </div>
                    </td>
                    <td colSpan="7" className="center aligned">
                      <strong>{key != 'undefined' ? key.replace('unknown', 'NA') : <span className="faded"><i>Unspecified</i></span>}</strong>
                      <span className="faded"> ({_.keys(samplesByCategory[key]).length} samples)</span>
                    </td>
                  </tr>
                );
                _.forEach(samplesByCategory[key], (sample) => {
                  keyRows.push(
                    <tr key={sample.id}>
                      <td>
                        <div className="ui fitted checkbox">
                          <input type="checkbox" value={sample.id}
                            checked={_.includes(this.state.selected, sample.id)}
                            onChange={this.toggle} /> <label></label>
                        </div>
                      </td>
                      <td>{sample.id}</td>
                      <td>{sample.name}</td>
                      <td>{numeral(sample.total_cnt).format('0,0')}</td>
                      <td>
                        {numeral(sample.sequence_cnt).format('0,0')}
                        <span className="faded">{' (' + numeral(sample.sequence_cnt / sample.total_cnt).format('0%') + ')'}</span>
                      </td>
                      <td>
                        {numeral(sample.functional_cnt).format('0,0')}
                        <span className="faded">{' (' + numeral(sample.functional_cnt / sample.sequence_cnt).format('0%') + ')'}</span>
                      </td>
                      <td className="delim">{numeral(sample.clone_cnt).format('0,0')}</td>
                      <td>
                        {numeral(sample.functional_clone_cnt).format('0,0')}
                        <span className="faded">{' (' + numeral(sample.functional_clone_cnt / sample.clone_cnt).format('0%') + ')'}</span>
                      </td>
                    </tr>
                  );
                })
                return keyRows;
              })}
          </tbody>
        </table>
      );
    });

    return (
      <div>
        <button className="ui primary labeled icon button"
                onClick={this.redirect.bind(this, (this.props.path || '') + 'sample-analysis/')}
                disabled={this.state.selected.length == 0}>
          <i className="chart bar icon"></i>
          Quick Analysis
        </button>

        <button className="ui labeled icon button"
                onClick={this.redirect.bind(this, (this.props.path || '') + 'export/')}
                disabled={this.state.selected.length == 0}>
          <i className="chart signal icon"></i>
          Custom Analysis...
        </button>

				<div className="ui pointing dropdown labeled icon button multiple" id="grouping-dropdown"
             style={{'float': 'right'}}>
          <input type="hidden" name="groupBy" />
          <i className="sidebar icon"></i>
          <div className="text">Group Samples By</div>
          <div className="menu">
            <div className="item" data-value="subject.identifier">Subject</div>
            {_.map(getMetadataFields(this.props.samples), m => <div className="item" key={m}
                data-value={'metadata.' + m}>{_.startCase(m)}</div>)}
          </div>
        </div>
        {finalElements}
      </div>
    );
  }
}
