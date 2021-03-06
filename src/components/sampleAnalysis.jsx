import numeral from 'numeral';

import React from 'react';

import API from '../api';
import Message from './message';
import SampleDetails from './sampleDetails';
import SampleCloneOverlaps from './sampleCloneOverlaps';
import { Heatmap, XYPlot } from './plot';

import { getMetadataFields } from '../utils';

class VGeneHeatmap extends React.Component {
  constructor() {
    super();
    this.state = {
      asyncState: 'loading'
    };
  }

  componentDidMount() {
    API.post(
      'samples/v_usage/' + this.props.sampleEncoding,
      {
        filter_type: this.props.filterType,
        include_outliers: this.props.includeOutliers,
        include_partials: this.props.includePartials,
        grouping: this.props.grouping,
        by_family: this.props.byFamily,
      }
    ).end((err, response) => {
      if (err) {
        this.setState({ asyncState: 'error' });
      } else {
        this.setState({
          asyncState: 'loaded',
          vUsage: response.body
        });
      }
    });
  }

  render() {
    if (this.state.asyncState == 'loading') {
      return <Message type='' icon='notched circle loading' header='Loading'
              message='Gathering V usage information' />;
    } else if (this.state.asyncState == 'error' || !this.state.vUsage) {
      return <Message type='error' icon='warning sign' header='Error'
              message='Unable to fetch V usage information' />;
    }

    return (
      <Heatmap {...this.state.vUsage} show={this.props.show}
        title={'V Gene Usage (excludes genes < 1% of ' +
            (_.includes(this.props.filterType, 'clones') ? 'clones' : 'sequences') + ')'} />
    );
  }
}

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
      grouping: 'sample',
      byFamily: false,
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
  }

  componentDidMount() {
    this.update();
  }

  update = () => {
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
        limit: 'sequences',
      }, {
        title: 'FWR Selection Pressure',
        key: 'sp_fwr_dist',
        type: 'column',
        limit: 'clones',
      }, {
        title: 'CDR Selection Pressure',
        key: 'sp_cdr_dist',
        type: 'column',
        limit: 'clones',
      }, {
        title: _.includes(this.state.filterType, 'clones') ? 'Clone Size' :'Copy Number',
        key: 'copy_number_dist',
        xLabel: _.includes(this.state.filterType, 'clones') ? 'Clone Size' : 'Copies',
        type: 'line',
      }
    ];

    this.setState({
      asyncState: 'loading',
      title: _.keyBy(_.flatten(_.values(this.filters)), 'name')[this.state.filterType].label +
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
      },
      lastResort: true
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
            <a className="item" onClick={this.toggle.bind(this, 'byFamily', false)}>
              {this.state.byFamily ? 'Set Heatmap to full V Gene' : 'Set Heatmap to V Gene Family'}
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
                    <a onClick={this.setGrouping.bind(this, 'sample')}
                      className={'item' + (this.state.grouping == 'sample' ? ' active' : '')}>
                        Sample
                    </a>
                    <a onClick={this.setGrouping.bind(this, 'subject')}
                      className={'item' + (this.state.grouping == 'subject' ? ' active' : '')}>
                      Subject
                    </a>


                    {_.map(getMetadataFields(this.state.sampleInfo.samples), (group) => {
                      return (
                        <a onClick={this.setGrouping.bind(this, group)}
                          className={'item' + (group.name == this.state.grouping ? ' active' : '')} key={group}>
                          {_.startCase(group)}
                        </a>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {_.includes(this.state.filterType, 'clones') ?
            <SampleCloneOverlaps sampleEncoding={this.props.params.sampleEncoding} filterType={this.state.filterType} />
            :
            ''
          }

          <VGeneHeatmap
            {...this.state}
            sampleEncoding={this.props.params.sampleEncoding}
            show={_.keys(this.state.sampleInfo.stats).length < SampleAnalysis.SHOW_THRESHOLD}
          />
          {_.map(this.plots, (plot) => {
            let isClones = _.includes(this.state.filterType, 'clones')
            if ((isClones && plot.limit == 'sequences') || (!isClones && plot.limit == 'clones')) {
              return '';
            }
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
