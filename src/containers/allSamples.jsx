import 'semantic';
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
      selected: [],
      samples: [],
      asyncState: 'loading',
      groupBy: 'date'
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
        selected: _.map(this.state.samples, s => s.id)
      });
    } else {
      this.setState({
        selected: []
      });
    }
  }

  toggleGroup = (e) => {
    let samples = _.pluck(
      _.filter(this.state.samples, s => _.get(s, this.state.groupBy) == e.target.value),
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

  showAnalysis = () => {
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
    window.open('/sample-analysis/' + encoding.join(''));
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
