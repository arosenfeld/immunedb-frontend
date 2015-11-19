import React from 'react';

import { removeAlleles } from '../utils';

class GeneCollapser extends React.Component {
  constructor() {
    super();
    this.state = {
      show: false
    }
  }

  toggle = () => {
    this.setState({
      show: !this.state.show
    });
  }

  render() {
    if (this.state.show) {
      return (
        <span>
          {this.props.gene} <i className="minus square outline icon" onClick={this.toggle}></i>
        </span>
      );
    }

    return (
      <span>
        {removeAlleles(this.props.gene)} <i className="plus square outline icon" onClick={this.toggle}></i>
      </span>
    );
  }
}

export default GeneCollapser;
