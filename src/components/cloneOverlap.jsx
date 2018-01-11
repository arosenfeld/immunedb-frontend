import numeral from 'numeral';

import React from 'react';

import { getMetadataFields, optional } from '../utils';

export default class OverlapList extends React.Component {
  constructor() {
    super();
    this.state = {
      show: false
    };
  }

  show = () => {
    this.setState({show: true});
  }

  getBody = () => {
    if (this.state.show) {
      return (
        <tbody>
          <tr className="active">
            <td>ID</td>
            <td>Name</td>
            {_.map(getMetadataFields(this.props.samples), m => {
              return <td>{_.startCase(m)}</td>;
            })}
            <td>Unique Seqs.</td>
            <td>Total Seqs.</td>
          </tr>
          {_.map(this.props.samples, (sample) => {
            return (
              <tr key={sample.id}>
                <td>{sample.id}</td>
                <td>{sample.name}</td>
                {_.map(getMetadataFields(this.props.samples), m => {
                  return <td>{optional(sample.metadata[m])}</td>;
                })}
                <td>{numeral(sample.unique).format('0,0')}</td>
                <td>{numeral(sample.total).format('0,0')}</td>
              </tr>
            );
          })}
        </tbody>
      );
    }

    return (
      <tbody>
        <tr>
          <td colSpan="9" className="center aligned">
            <div className="ui labeled button" tabIndex="0" onClick={this.show}>
              <div className="ui button">
                <i className="level down icon"></i> Show Samples
              </div>
              <a className="ui basic left pointing label">
                {this.props.samples.length}
              </a>
            </div>
          </td>
        </tr>
      </tbody>
    );
  }

  render() {
    return (
      <table className="ui structured teal table">
        <thead>
          <tr>
            <th colSpan="9">Samples</th>
          </tr>
        </thead>
        {this.getBody()}
      </table>
    );
  };
}


