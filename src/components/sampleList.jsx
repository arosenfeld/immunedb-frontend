import 'semantic-ui-css/semantic.css';
import 'semantic-ui-css/semantic.js';

import numeral from 'numeral';
import lodash from 'lodash';

import React from 'react';

import API from '../api';
import Message from './message';

export default class SampleList extends React.Component {
  constructor() {
    super();
    this.state = {
      selected: [],
      groupBy: 'date'
    };
  }

  componentDidMount() {
    $('#export-dropdown').dropdown({
      action: 'hide',
      onChange: (value, text) => {
        this.redirect('export/' + value + '/sample/');
      }
    });

    $('#grouping-dropdown').dropdown({
      onChange: (value, text) => {
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

  redirect = (path) => {
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
    window.open(path + encoding.join(''));
  }

  render() {
    let sampleHierarchy = _.groupBy(this.props.samples, s => s.subject.study.name);
    sampleHierarchy = _.mapValues(sampleHierarchy,
      (studySamples) => _.groupBy(studySamples, s => _.get(s, this.state.groupBy))
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
        <table className="ui single line teal table" key={study}>
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
                    <td colSpan="5" className="center aligned">
                      <strong>{key}</strong>
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
        <button className="ui primary button"
                onClick={this.redirect.bind(this, (this.props.path || '') + 'sample-analysis/')}
                disabled={this.state.selected.length == 0}>
          Analyze Selected
        </button>

				<div className={'ui pointing dropdown labeled icon button exporting' + (this.state.selected.length == 0 ? ' disabled' : '')}
             id="export-dropdown">
					<i className="dropdown icon"></i>
					<span className="text">Export Selected</span>
					<div className="menu">
						<div className="item" data-value="sequences">Sequences</div>
						<div className="item" data-value="clones">Clones</div>
						<div className="item" data-value="mutations">Mutations</div>
          </div>
        </div>

				<div className="ui pointing dropdown labeled icon button" id="grouping-dropdown" style={{float: 'right'}}>
          <input type="hidden" name="groupBy" />
          <i className="sidebar icon"></i>
          <div className="text">Group Samples By</div>
          <div className="menu">
            <div className="item" data-value="date">Date</div>
            <div className="item" data-value="subject.identifier">Subject</div>
            <div className="item" data-value="tissue">Tissue</div>
            <div className="item" data-value="subset">Subset</div>
            <div className="item" data-value="ig_class">Ig Class</div>
            <div className="item" data-value="timepoint">Timepoint</div>
            <div className="item" data-value="disease">Disease</div>
            <div className="item" data-value="v_primer">V Primer</div>
            <div className="item" data-value="j_primer">J Primer</div>
          </div>
        </div>
        {finalElements}
      </div>
    );
  }
}
