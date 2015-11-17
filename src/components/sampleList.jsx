import 'semantic';
import numeral from 'numeral';
import lodash from 'lodash';

import React from 'react';
import connectToStores from 'alt/utils/connectToStores';

import API from '../api';
import Message from './message';
import SampleActions from '../actions/samples';
import SampleStore from '../stores/samples';

export default class SampleList extends React.Component {
  static getStores() {
    return [SampleStore];
  }

  static getPropsFromStores() {
    return SampleStore.getState();
  }

  constructor() {
    super();
    this.state = {
      selected: [],
      groupBy: 'date'
    };
    SampleActions.getAll();
  }

  componentDidUpdate() {
    $('.ui.dropdown').dropdown({
      action: 'hide',
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
    let samples = _.pluck(
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

  render() {
    if (this.props.asyncState == 'loading') {
      return <Message type='' icon='notched circle loading' header='Loading'
              message='Gathering sample information' />;
    } else if (this.props.asyncState == 'error') {
      return <Message type='error' icon='warning sign' header='Error'
              message='Unable to fetch sample information' />;
    }

    let sampleHierarchy = _.groupBy(this.props.samples, s => s.subject.study.name);
    sampleHierarchy = _.mapValues(sampleHierarchy,
      (studySamples) => _.groupBy(studySamples, s => _.get(s, this.state.groupBy))
    );

    let finalElements = [];
    _.forIn(sampleHierarchy, (samplesByCategory, study) => {
      finalElements.push(<h1 key={study + '_header'}>{study}</h1>);

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
                    <td colSpan="5" className="center aligned"><strong>{key}</strong></td>
                  </tr>
                );
                _.forEach(samplesByCategory[key], (sample) => {
                  keyRows.push(
                    <tr key={sample.id}>
                      <td>
                        <div className="ui fitted checkbox">
                          <input type="checkbox" value={sample.id}
                            checked={_.contains(this.state.selected, sample.id)}
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
        <button className="ui primary button">
          Analyze Selected
        </button>
        <div className="ui selection dropdown right floated">
          <input type="hidden" name="groupBy" onChange={this.setGrouping} />
          <i className="dropdown icon"></i>
          <div className="default text">Group by...</div>
          <div className="menu">
            <div className="item" data-value="date">Date</div>
            <div className="item" data-value="subject.identifier">Subject</div>
            <div className="item" data-value="tissue">Tissue</div>
            <div className="item" data-value="subset">Subset</div>
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

export default connectToStores(SampleList);
