import numeral from 'numeral';

import React from 'react';

import API from '../api';
import Message from './message';
import { optional } from '../utils';

export default class MutationsView extends React.Component {
  constructor() {
    super();
    this.state = {
      asyncState: 'loading',
      unique: true,
      threshold: {
        type: 'percent',
        value: 0,
      },
      mutations: {}
    };
  }

  componentDidMount() {
    $('.ui.dropdown').dropdown({
      action: 'hide',
      onChange: (value, text) => {
        let threshold = _.extend({}, this.state.threshold);
        threshold.type = value;
        this.setState({
          threshold
        });
      }
    });

    this.update();
  }

  update = () => {
    this.setState({ asyncState: 'loading' });
    API.post('clone/mutations/' + this.props.cloneId, {
      type: this.state.threshold.type,
      value: this.state.threshold.value
    }).end((err, response) => {
      if (err) {
        this.setState({ asyncState: 'error' });
      } else {
        this.setState({
          mutations: response.body,
          asyncState: 'loaded'
        });
      }
    });
  }

  getCell(muts, total, className='') {
    if (!muts) {
      return (
        <td className={className}>
          0 <span className="faded">(0.0%)</span>
        </td>
      );
    }

    return (
      <td className={className}>
        {numeral(muts).format('0,0') + ' '}
        <span className="faded">({numeral(muts / total).format('0.0%')})</span>
      </td>
    );
  }

  updateThreshold = (e) => {
    let threshold = _.extend({}, this.state.threshold);
    threshold.value = e.target.value;
    this.setState({
      threshold
    });
  }

  render() {
    if (this.state.asyncState == 'loading') {
      return <Message type='' icon='notched circle loading' header='Loading'
              message='Gathering mutation information' />;
    } else if (this.state.asyncState == 'error' || !this.state.mutations) {
      return <Message type='error' icon='warning sign' header='Error'
              message='Unable to fetch mutation information' />;
    }

    return (
      <div className="ui segment teal">
        <div className="ui form">
          <div className="fields">
            <div className="inline field">
              <label>Show mutations appearing in at least</label>
              <input type="number" name="value" defaultValue={this.state.threshold.value} onChange={this.updateThreshold}/>
            </div>
            <div className="inline field">
              <select name="type" defaultValue={this.state.threshold.type}>
                <option value="percent">percent of sequences</option>
                <option value="sequences">sequences</option>
              </select>
            </div>
            <button className="ui primary button" onClick={this.update}>
              Filter
            </button>
          </div>
        </div>

        <table className="ui table red">
          <thead>
            <tr>
              <th colSpan="6">Mutations</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="active">Region</td>
              <td className="active">Synonymous</td>
              <td className="active">Non-synonymous</td>
              <td className="active">Unknown</td>
              <td className="active">Conservative</td>
              <td className="active">Non-conservative</td>
            </tr>
            {_.map(_.keys(this.state.mutations.regions).sort(), (region) => {
              let muts = this.state.mutations.regions[region].counts[this.state.unique ? 'unique' : 'total'];
              let total = _.sum(muts);
              return (
                <tr key={region}>
                  <td><strong>{region}</strong></td>
                  {this.getCell(muts.synonymous, total)}
                  {this.getCell(muts.conservative + muts.nonconservative, total)}
                  {this.getCell(muts.unknown, total)}
                  {this.getCell(muts.conservative, total, 'warning')}
                  {this.getCell(muts.nonconservative, total, 'warning')}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }
}
