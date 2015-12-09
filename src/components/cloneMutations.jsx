import numeral from 'numeral';

import React from 'react';

import API from '../api';
import Message from './message';
import { optional, colorAAs, colorNTs } from '../utils';

class MutationDetails extends React.Component {
  constructor() {
    super();
    this.state = {
      sort: 'unique'
    };
  }

  componentDidMount() {
    $('.ui.modal').modal({
      detachable: false,
    });
  }

  hide = () => {
    $('.ui.modal').modal('hide');
  }

  render() {
    return (
			<div className="ui fullscreen modal">
				<div className="header">Mutations in {this.props.region}</div>
				<div className="content">
          <table className="ui table">
            <thead>
              <tr>
                <th>Count</th>
                <th>Copies </th>
                <th>Position</th>
                <th>NT Mutation</th>
                <th>Hypothetical AA Mutation</th>
                <th>Final AA Mutations</th>
              </tr>
            </thead>
            <tbody>
              {_.map(_.keys(this.props.mutations), (region) => {
                let rows = [
                  <tr key={region}>
                    <td className="active" colSpan="6">{_.capitalize(region)}</td>
                  </tr>
                ];
                let i = 0;
                _.each(_.sortBy(this.props.mutations[region], this.state.sort).reverse(), (mutation) => {
                  rows.push(
                    <tr key={i++}>
                      <td>{numeral(mutation.unique).format('0,0')}</td>
                      <td>{numeral(mutation.total).format('0,0')}</td>
                      <td>{mutation.pos}</td>
                      <td>{colorNTs(mutation.from_nt)} to {colorNTs(mutation.to_nt)}</td>
                      {region == 'unknown' ?
                        [
                          <td className="faded" key="int_aa">N/A</td>,
                          <td className="faded" key="fnl_aa">N/A</td>
                        ]
                      :
                      [
                        <td key="int_aa">{colorAAs(mutation.from_aa)} to {colorAAs(mutation.intermediate_aa)}</td>,
                        <td key="fnl_aa">{colorAAs(mutation.from_aa)} to {_.map(mutation.to_aas, (aa) => colorAAs(aa))}</td>]
                      }
                    </tr>
                  );
                });
                return rows;
              })}
            </tbody>
          </table>
				</div>
			</div>
    );
  }
}

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
      mutations: {},
      details: null
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

  showModal = () => {
    $('.ui.modal').modal('show');
  }

  showMutations = (region, mutations) => {
    this.setState({
      details: {
        region,
        mutations
      }
    }, this.showModal);
  }

  getModal = () => {
    if (this.state.details) {
      return <MutationDetails region={this.state.details.region} mutations={this.state.details.mutations} />
    }
    return <div></div>;
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
        <h4>Mutations</h4>
        {this.getModal()}
        <div className="ui form">
          <div className="fields">
            <div className="inline field">
              <label>Show mutations appearing in at least</label>
              <input type="number" min="0" name="value" defaultValue={this.state.threshold.value} onChange={this.updateThreshold}/>
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
              let cnts = this.state.mutations.regions[region].counts[this.state.unique ? 'unique' : 'total'];
              let muts = this.state.mutations.regions[region].mutations;
              let total = _.sum(cnts);
              return (
                <tr key={region}>
                  <td>
                    <strong>{region}</strong>{' '}
                    <button className="ui label" onClick={this.showMutations.bind(this, region, muts)}>
                      <i className="unhide icon"></i> View Mutations
                    </button>
                  </td>
                  {this.getCell(cnts.synonymous, total)}
                  {this.getCell(cnts.conservative + cnts.nonconservative, total)}
                  {this.getCell(cnts.unknown, total)}
                  {this.getCell(cnts.conservative, total, 'warning')}
                  {this.getCell(cnts.nonconservative, total, 'warning')}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }
}
