import React from 'react';

import { removeAlleles } from '../utils';

class GeneCollapser extends React.Component {
  render() {
    return (
      <span className="popup underlined ties" data-content={this.props.gene}>
        {removeAlleles(this.props.gene)}
      </span>
    );
  }
}

export default GeneCollapser;
