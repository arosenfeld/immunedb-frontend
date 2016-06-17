import 'semantic-ui-css/semantic.css';
import 'semantic-ui-css/semantic.js';

import numeral from 'numeral';

import React from 'react';

import API from '../api';
import Message from './message';

export default class ClonePressure extends React.Component {
  constructor() {
    super();
    this.state = {
      asyncState: 'loading',
      filter: '1',
      allSamples: false,
      pressure: null
    };
  }

  componentDidMount() {
    API.post('clone/pressure/' + this.props.cloneId).end((err, response) => {
      if (err) {
        this.setState({ asyncState: 'error' });
      } else {
        this.setState({
          asyncState: 'loaded',
          pressure: response.body
        });
      }
    });
  }

  componentDidUpdate() {
    $('#filter-dropdown').dropdown({
      onChange: (value, text) => {
        this.setState({
          filter: value
        });
      }
    });
  }

  getPressureColor(prob) {
    prob = parseFloat(prob);
    if (isNaN(prob)) {
      return '#ffffff';
    } else if (prob < 0) {
      var others = parseInt(0xff - 0xff * -prob).toString(16);
      return '#' + others + 'ff' + others;
    } else {
      var others = parseInt(0xff - 0xff * prob).toString(16);
      return '#ff' + others + others;
    }
  }

  toggleSamples = () => {
    this.setState({
      allSamples: !this.state.allSamples
    });
  }

  toggleMultiple = () => {
    this.setState({
      filter: this.state.filter == 'all' ? 'multiples' : 'all'
    });
  }

  getBody = () => {
    let pressure = this.state.allSamples ? this.state.pressure : _.filter(this.state.pressure,
        (p) => p.sample.id == null);
    pressure = _.sortBy(pressure, (p) => p.sample.id).reverse();
    return (
      <table className="ui celled red table">
        <tbody>
          <tr className="bold center aligned">
            <td></td>
            <td colSpan="4">Observed Mutations</td>
            <td colSpan="4">Expected Mutations</td>
            <td colSpan="4">Focused Test</td>
          </tr>
          <tr className="bold center aligned">
            <td></td>
            <td colSpan="2">CDR</td>
            <td colSpan="2">FRW</td>
            <td colSpan="2">CDR</td>
            <td colSpan="2">FRW</td>

            <td colSpan="2">Selection Value</td>
            <td colSpan="2">95% CI</td>
          </tr>
          <tr className="bold center aligned active">
            <td>Sample</td>
            <td>S</td>
            <td>R</td>
            <td>S</td>
            <td>R</td>

            <td>S</td>
            <td>R</td>
            <td>S</td>
            <td>R</td>

            <td>CDR</td>
            <td>FRW</td>
            <td>CDR</td>
            <td>FRW</td>
          </tr>
          {_.map(pressure, (p) => {
            return (
              <tr key={p.sample.name} className="center aligned">
                <td>{p.sample.name}</td>
                <td>{p.pressure[this.state.filter].Observed_CDR_S}</td>
                <td>{p.pressure[this.state.filter].Observed_CDR_R}</td>
                <td>{p.pressure[this.state.filter].Observed_FWR_S}</td>
                <td>{p.pressure[this.state.filter].Observed_FWR_R}</td>

                <td>{p.pressure[this.state.filter].Expected_CDR_S}</td>
                <td>{p.pressure[this.state.filter].Expected_CDR_R}</td>
                <td>{p.pressure[this.state.filter].Expected_FWR_S}</td>
                <td>{p.pressure[this.state.filter].Expected_FWR_R}</td>

                <td
                  style={{backgroundColor: this.getPressureColor(p.pressure[this.state.filter].Focused_P_CDR)}}>
                  {p.pressure[this.state.filter].Focused_Sigma_CDR}
                </td>
                <td
                  style={{backgroundColor: this.getPressureColor(p.pressure[this.state.filter].Focused_P_FWR)}}>
                  {p.pressure[this.state.filter].Focused_Sigma_FWR}
                </td>

                <td>
                  {
                    p.pressure[this.state.filter].Focused_CIlower_CDR + ', ' +
                    p.pressure[this.state.filter].Focused_CIupper_CDR
                  }
                </td>
                <td>
                  {
                    p.pressure[this.state.filter].Focused_CIlower_FWR + ', ' +
                    p.pressure[this.state.filter].Focused_CIupper_FWR
                  }
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  }

  readableThreshold = (threshold) => {
    if (_.endsWith(threshold, '%')) {
      return '>= ' + threshold + ' of sequences';
    } else if (_.endsWith(threshold, 'E')) {
      return 'exactly ' + threshold.slice(0, -1) + ' sequences';
    }
    return '>= ' + threshold + ' sequences';
  }

  render() {
    if (this.state.asyncState == 'loading') {
      return <Message type='' icon='notched circle loading' header='Loading'
              message='Gathering selection information' />;
    } else if (this.state.asyncState == 'error' || !this.state.pressure) {
      return <Message type='error' icon='warning sign' header='Error'
              message='Unable to fetch selection information' />;
    }

    if (this.state.pressure.length == 0) {
      return (
        <div className="ui teal segment">
          <h4>Selection Pressure</h4>
          <div className="ui message warning">
            Selection pressure has not been calculated for this clone
          </div>
        </div>
      );
    }

    return (
      <div className="ui teal segment">
        <h4>Selection Pressure</h4>
        <div className="ui form">
          <div className="inline field">
            <label>Show selection pressure per-sample</label>
            <input type="checkbox" checked={this.state.allSamples} onChange={this.toggleSamples} />
          </div>
          <div className="inline field">
            <div className="ui pointing dropdown labeled icon button" id="filter-dropdown">
              <input type="hidden" name="filterMutations" />
              <i className="filter icon"></i>
              <div className="text">Include mutations in...</div>
              <div className="menu">
                {_.map(_.keys(this.state.pressure[0].pressure), (key) => {
                  return <div className="item" data-value={key} key={key}>{
                    (key == 1 ?
                      'Include all mutations' :
                      'Include mutations in ' + this.readableThreshold(key)
                    )
                  }</div>
                })}
              </div>
            </div>
          </div>
        </div>
        {this.getBody()}
      </div>
    );
  }
}

