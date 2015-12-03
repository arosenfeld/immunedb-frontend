import numeral from 'numeral';

import React from 'react';

import API from '../api';
import Message from './message';
import SampleDetails from './sampleDetails';
import SampleCloneOverlaps from './sampleCloneOverlaps';
import {XYPlot} from './plot';

export default class SampleAnalysis extends React.Component {
  static SHOW_THRESHOLD = 25;
  constructor() {
    super();
    this.state = {
      asyncState: 'loading',
      filterType: 'unique_multiple',
      includeOutliers: true,
      includePartials: true,
      percentages: false,
      grouping: 'name',
      stack: true
    };

    this.filters = {
      clones: [
        {name: 'clones_all', label: 'All'},
        {name: 'clones_functional', label: 'Functional'},
        {name: 'clones_nonfunctional', label: 'Non-Functional'},
      ],
      sequences: [
        {name: 'all', label: 'All'},
        {name: 'functional', label: 'Functional'},
        {name: 'unique', label: 'Functional & Unique'},
        {name: 'unique_multiple', label: 'Functional, Unique & Copy Number > 1'},
        {name: 'nonfunctional', label: 'Non-Functional'},
      ]
    };

    this.groupings = [
      {name: 'name', label: 'Sample'},
      {name: 'subject', label: 'Subject'},
      {name: 'tissue', label: 'Tissue'},
      {name: 'subset', label: 'Subset'},
      {name: 'ig_class', label: 'Ig Class'},
      {name: 'disease', label: 'Disease'},
    ];

		this.plots = [
      {
        title: 'CDR3 Length',
        key: 'cdr3_length_dist',
        type: 'column',
      }, {
        title: 'V Gene Length',
        key: 'v_length_dist',
        type: 'column',
      }, {
        title: 'V Nucleotides Matching Germline',
        key: 'v_match_dist',
        type: 'column',
      }, {
        title: 'Percentage of V Nucleotides Matching Germline',
        key: 'v_identity_dist',
        xLabel: 'Percentage',
        type: 'column',
      }, {
        title: 'J Gene Length',
        key: 'j_length_dist',
        type: 'column',
      }, {
        title: 'J Nucleotides Matching Germline',
        key: 'j_match_dist',
        type: 'column',
      }, {
        title: 'Phred Quality Score',
        xLabel: 'Position',
        yLabel: 'Avg. Phred Quality Score',
        key: 'quality_dist',
        type: 'line',
      },{
        title: 'Copy Number',
        key: 'copy_number_dist',
        xLabel: 'Copies',
        type: 'column',
      }
    ];
  }

  componentDidMount() {
    this.update();
  }

  update = () => {
    this.setState({
      asyncState: 'loading',
      title: _.indexBy(_.flatten(_.values(this.filters)), 'name')[this.state.filterType].label +
          (_.includes(this.state.filterType, 'clones') ? ' Clones' : ' Sequences')
    });
    API.post(
      'samples/analyze/' + this.props.params.sampleEncoding,
      {
        filter_type: this.state.filterType,
        include_outliers: this.state.includeOutliers,
        include_partials: this.state.includePartials,
        percentages: this.state.percentages,
        grouping: this.state.grouping,
      }
    ).end((err, response) => {
      if (err) {
        this.setState({ asyncState: 'error' });
      } else {
        this.setState({
          asyncState: 'loaded',
          sampleInfo: response.body
        });
      }
    });
  }

	componentDidUpdate() {
    let popupOptions = {
      inline: true,
      hoverable: true,
      position: 'bottom left',
      delay: {
        show: 100,
        hide: 300
      }
    }
		$('.menu .show-filters').popup(_.extend({}, popupOptions, {popup: $('#filter-list')}));
		$('.menu .show-groups').popup(_.extend({}, popupOptions, {popup: $('#group-list')}));

    $('.ui.sticky').sticky({
      offset: 50
    });
	}

  setFilter = (filterType) => {
    $('.menu .show-filters').popup('toggle');
    this.setState({
      asyncState: 'loading',
      filterType
    }, this.update);
  }

  setGrouping = (grouping) => {
    $('.menu .show-groups').popup('toggle');
    this.setState({
      asyncState: 'loading',
      grouping
    }, this.update);
  }

  toggle = (field, update=true) => {
    this.setState({
      asyncState: 'loading',
      [field]: !this.state[field]
    }, update ? this.update : () => this.setState({ asyncState: 'loaded'}));
  }

  render() {
    if (this.state.asyncState == 'loading') {
      return <Message type='' icon='notched circle loading' header='Loading'
              message='Gathering sample information' />;
    } else if (this.state.asyncState == 'error' || !this.state.sampleInfo) {
      return <Message type='error' icon='warning sign' header='Error'
              message='Unable to fetch sample information' />;
    }
    return (
      <div>
        {_.keys(this.state.sampleInfo.stats).length > SampleAnalysis.SHOW_THRESHOLD ?
          <div className="ui warning message">
            <div className="header">
            Hiding Plots
            </div>
            Plots have been hidden because there are more than
            <strong>{' ' + SampleAnalysis.SHOW_THRESHOLD + ' '}</strong> (currently
                {' ' + _.keys(this.state.sampleInfo.stats).length})
            data series.  You may show individual plots by clicking the associated button or group by another parameter
            to show all plots at once.
          </div>
          :
          ''
        }
        <div className="ui teal segment">
          <h4>Filter Analysis</h4>
          <button className="ui primary button" onClick={this.toggle.bind(this, 'includePartials')}>
            {this.state.includePartials ? 'Exclude ' : 'Include '}Partial Reads
          </button>
          <button className="ui primary button" onClick={this.toggle.bind(this, 'includeOutliers')}>
            {this.state.includeOutliers ? 'Exclude ' : 'Include '}Outlier Reads
          </button>
        </div>

        <SampleDetails samples={this.state.sampleInfo.samples} />
        <div className="ui teal segment">
          <h4>Currently Showing: {this.state.title}</h4>
          <div className="ui teal menu sticky">
            <a className="show-filters item">
              Show Only...
              <i className="dropdown icon"></i>
            </a>
            <a className="show-groups item">
              Set Grouping
              <i className="dropdown icon"></i>
            </a>
            <a className="item" onClick={this.toggle.bind(this, 'percentages')}>
              {this.state.percentages ? 'Switch to Raw Values on Y-Axes' : 'Switch to Percentages on Y-Axes'}
            </a>
            <a className="item" onClick={this.toggle.bind(this, 'stack', false)}>
              {this.state.stack ? 'Un-stack Plots' : 'Stack Plots'}
            </a>
            <div className="ui fluid popup bottom left transition hidden" id="filter-list">
              <div className="ui two column relaxed divided grid">
                <div className="column">
                  <h4 className="ui header">Clones</h4>
                  <div className="ui link list">
                    {_.map(this.filters.clones, (filter) => {
                      return (
                        <a onClick={this.setFilter.bind(this, filter.name)} className="item" key={filter.name}>
                          <div className="ui horizontal label small">
                            {numeral(this.state.sampleInfo.counts[filter.name]).format('0a')}
                          </div>
                          {filter.label}
                        </a>
                      );
                    })}
                  </div>
                </div>
                <div className="column">
                  <h4 className="ui header">Sequences</h4>
                  <div className="ui link list">
                    {_.map(this.filters.sequences, (filter) => {
                      return (
                        <a onClick={this.setFilter.bind(this, filter.name)}
                          className={'item' + (filter.name == this.state.filterType ? ' active' : '')} key={filter.name}>
                          <div className="ui horizontal label small">
                            {numeral(this.state.sampleInfo.counts[filter.name]).format('0a')}
                          </div>
                          {filter.label}
                        </a>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
            <div className="ui popup bottom left transition hidden" id="group-list">
              <div className="ui one column relaxed divided grid">
                <div className="column">
                  <div className="ui link list">
                    {_.map(this.groupings, (group) => {
                      return (
                        <a onClick={this.setGrouping.bind(this, group.name)}
                          className={'item' + (group.name == this.state.grouping ? ' active' : '')} key={group.name}>
                          {group.label}
                        </a>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {_.includes(this.state.filterType, 'clones') ?
            <SampleCloneOverlaps sampleEncoding={this.props.params.sampleEncoding} />
            :
            ''
          }

          {_.map(this.plots, (plot) => {
            return <XYPlot
              title={plot.title}
              series={this.state.sampleInfo.stats}
              plotKey={plot.key}
              key={plot.key}
              type={plot.type}
              xLabel={plot.xLabel || 'Nucleotides'}
              yLabel={plot.yLabel ||
                (this.state.percentages ? '% of ' : '') +
                  (_.includes(this.state.filterType, 'clones') ? 'Clones' : 'Sequences')}
              show={_.keys(this.state.sampleInfo.stats).length < SampleAnalysis.SHOW_THRESHOLD}
              stack={this.state.stack}
            />
         })}

        </div>
      </div>
    );
  }
}

export default SampleAnalysis;
