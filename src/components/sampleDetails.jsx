import numeral from 'numeral';

import React from 'react';

export default class SampleDetails extends React.Component {
  render() {
    return (
      <table className="ui structured teal table">
        <thead>
          <tr>
            <th colSpan="10">Sample Overview (reflects outlier / partial filters)</th>
          </tr>
        </thead>
        <tbody>
          <tr className="active">
            <td>ID</td>
            <td>Name</td>
            <td>Total Seqs.</td>
            <td>Identifiable</td>
            <td>Functional</td>
            <td>Funct. & Unique</td>
            <td>Funct. & Unique & CN > 1</td>
            <td>Clones</td>
            <td>Funct. Clones</td>
          </tr>
          {_.map(this.props.samples, (sample) => {
            return (
              <tr key={sample.id}>
                <td>{sample.id}</td>
                <td>{sample.name}</td>
                <td>
                  {
                    numeral(sample.total_cnt).format('0,0')
                  }
                </td>
                <td>
                  {numeral(sample.sequence_cnt).format('0,0')}
                  <span className="faded">{' (' + numeral(sample.sequence_cnt / sample.total_cnt).format('0%') + ')'}</span>
                </td>
                <td>
                  {numeral(sample.functional_cnt).format('0,0')}
                  <span className="faded">{' (' + numeral(sample.functional_cnt / sample.total_cnt).format('0%') + ')'}</span>
                </td>
                <td>
                  {numeral(sample.unique_cnt).format('0,0')}
                  <span className="faded">{' (' + numeral(sample.unique_cnt / sample.total_cnt).format('0%') + ')'}</span>
                </td>
                <td>
                  {numeral(sample.unique_multiple_cnt).format('0,0')}
                  <span className="faded">{' (' + numeral(sample.unique_multiple_cnt / sample.total_cnt).format('0%') + ')'}</span>
                </td>
                <td>
                  {numeral(sample.clones_cnt).format('0,0')}
                </td>
                <td>
                  {numeral(sample.clones_functional_cnt).format('0,0')}
                  <span className="faded">{' (' + numeral(sample.clones_functional_cnt / sample.clones_cnt).format('0%') + ')'}</span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  };
}
