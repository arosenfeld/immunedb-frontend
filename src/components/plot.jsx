import React from 'react';

import Highcharts from 'react-highcharts/dist/bundle/highcharts';
import ReactHighcharts from 'react-highcharts';

export class XYPlot extends React.Component {
  getConfig = () => {
    let series = _.map(_.keys(this.props.series), (name) => {
      return {
        name,
        data: this.props.series[name][this.props.plotKey],
        turboThreshold: 0
      };
    });

		return {
      chart: {
        type: this.props.type,
        zoomType: 'x',
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
			series: series,
			key: this.props.plotKey,

			exporting: {
				scale: 4,
			},
		}
	}

  render() {
    return (
      <div className="ui red segment">
        <ReactHighcharts config={this.getConfig()} />
      </div>
    );
  }
}
