import numeral from 'numeral';
import React from 'react';

import Highcharts from 'react-highcharts/dist/bundle/highcharts';
import 'highcharts-exporting/exporting';
import 'highcharts-offline-exporting/offline-exporting';
import 'highcharts-heatmap/heatmap';
import ReactHighcharts from 'react-highcharts';

import {removeAlleles} from '../utils';

export class Heatmap extends React.Component {
  constructor() {
    super();
    this.state = {
      show: false
    };
  }

  show = () => {
    this.setState({show: true});
  }

  getConfig = () => {
    let propsP = this.props;
    let config = {
      chart: {
        type: 'heatmap',
        animation: false,
        style: {
          fontFamily: '\'Lato\', \'Helvetica Neue\', Arial, Helvetica, sans-serif',
          fontSize: '1em'
        },
        height: 100 + 25 * this.props.y_categories.length,
      },

      title: {
        text: this.props.title
      },

      credits: {
        enabled: false
      },

      xAxis: {
        categories: this.props.x_categories,
        title: 'IGHV Gene',
        labels: {
          rotation: 90
        }
      },

      yAxis: {
        categories: _.map(this.props.y_categories, (y) =>
          y + ' (' + numeral(this.props.totals[y]).format('0,0') + ')'
        ),
        reversed: true,
        title: 'Sample',
      },

      colorAxis: {
        stops: [
          [0, '#0000ff'],
          [.5, '#ffffff'],
          [1, '#ff0000'],
        ],
      },

      series: [{
        data: this.props.data,
        turboThreshold: 0
      }],

      tooltip: {
        style: {
          padding: 20,
        },
        formatter: function() {
          return (
            '<b>Sample:</b> ' +
              propsP.y_categories[this.point.y] + '<br />' +
            '<b>Gene:</b> ' +
              removeAlleles(propsP.x_categories[this.point.x]) + '<br />' +
            '<b>% of Sample:</b> ' +
            this.point.value.toFixed(2) + '%'
          );
        }
      },

      legend: {
        enabled: true
      }
    }

    if (this.props.y_categories.length <= 5) {
      config.chart.height += _.max(_.map(this.props.x_categories, (e) => e.length)) * 12;
    }
    return config;
  }

  render() {
    return (
      <div className="ui red segment">
        <ReactHighcharts config={this.getConfig()} />
      </div>
    );
  }
}

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
        filename: this.props.plotKey,
        fallbackToExportServer: false
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
