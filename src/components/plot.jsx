import React from 'react';

import Highcharts from 'react-highcharts/dist/bundle/highcharts';
import ReactHighcharts from 'react-highcharts';

export class XYPlot extends React.Component {
  constructor() {
    super();
    this.state = {
      show: false
    };
  }

  show = () => {
    this.setState({show: true});
  }

  componentWillMount() {
    this.series = _.map(_.keys(this.props.series), (name) => {
      return {
        name,
        data: this.props.series[name][this.props.plotKey],
      };
    });

    this.setState({
      show: this.props.show
    });
  }

  getConfig = () => {
		return {
      chart: {
        type: this.props.type,
        animation: false,
        zoomType: 'x',
        style: {
          fontFamily: '\'Lato\', \'Helvetica Neue\', Arial, Helvetica, sans-serif',
          fontSize: '1em'
        }
      },

      plotOptions: {
        series: {
          animation: false
        },
        column: {
          grouping: !this.props.stack,
          shadow: false
        }
      },

			credits: {
				enabled: false
			},

			title: {
				text: this.props.title
			},

			xAxis: {
				title: {
					text: this.props.xLabel
				},
			},

			yAxis: {
				title: {
					text: this.props.yLabel
				}
			},

			loading: false,
			series: this.series,
			key: this.props.plotKey,

			exporting: {
				scale: 4,
			},
		}
	}

  render() {
    if (!this.state.show) {
      return (
        <div className="ui red center aligned segment">
          <h4>{this.props.title}</h4>
          <button className="ui labeled icon button" onClick={this.show}>
            <i className="level down icon"></i>
            Show Plot
          </button>
        </div>
      );
    }
    if (_.all(_.pluck(this.series, 'data'), (e) => e.length == 0)) {
      return (
        <div className="ui red center aligned segment">
          <h4>{this.props.title}</h4>
          No data points for this plot
        </div>
      );
    }
    return (
      <div className="ui red segment">
        <ReactHighcharts config={this.getConfig()} />
      </div>
    );
  }
}
