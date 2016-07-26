import numeral from 'numeral';

import React from 'react';
import { Link } from 'react-router';

import { colorAAs, colorNTs, optional } from '../utils';

export default class SubcloneList extends React.Component {
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
            <td>CDR3 Nucleotides</td>
            <td>CDR3 Amino-acids</td>
            <td>Insertions</td>
            <td>Deletions</td>
            <td>Unique Seqs.</td>
            <td>Total Seqs.</td>
          </tr>
          {_.map(_.reverse(_.sortBy(this.props.subclones, 'overall_unique_cnt')), (clone) => {
            return (
              <tr key={clone.id}>
                <td><Link to={'clone/' + clone.id} target='_blank'>{clone.id}</Link></td>
                <td className="text-mono sequence">{colorNTs(clone.cdr3_nt)}</td>
                <td className="text-mono sequence">{colorAAs(clone.cdr3_aa)}</td>
                <td>{optional(clone.insertions.length, '-')}</td>
                <td>{optional(clone.deletions.length, '-')}</td>
                <td>{clone.overall_unique_cnt}</td>
                <td>{clone.overall_total_cnt}</td>
              </tr>
            );
          })}
        </tbody>
      );
    }

    return (
      <tbody>
        <tr>
          <td colSpan="7" className="center aligned">
            <div className="ui labeled button" tabIndex="0" onClick={this.show}>
              <div className="ui button">
                <i className="level down icon"></i> Show Subclones
              </div>
              <a className="ui basic left pointing label">
                {this.props.subclones.length}
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
            <th colSpan="7">Subclones</th>
          </tr>
        </thead>
        {this.getBody()}
      </table>
    );
  };
}


