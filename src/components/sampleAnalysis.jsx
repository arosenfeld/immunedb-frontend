import numeral from 'numeral';

import React from 'react';

import API from '../api';
import Message from './message';

export default class SampleAnalysis extends React.Component {
  constructor() {
    super();
    this.state = {
      asyncState: 'loading',
      filterType: 'unique_multiple',
      includeOutliers: true,
      includePartials: true,
      percentages: false,
      grouping: 'name'
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
		$('.menu .show-filters').popup({
      popup: $('#filter-list'),
      inline: true,
      hoverable: true,
      position: 'bottom left',
      delay: {
        show: 100,
        hide: 100
      }
    });
    $('.dropdown').dropdown();
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
				<div className="ui menu">
					<a className="show-filters item">
            Set View
						<i className="dropdown icon"></i>
					</a>
					<div className="ui fluid popup bottom left transition hidden" id="filter-list">
						<div className="ui two column relaxed divided grid">
              <div className="column">
                <h4 className="ui header">Clones</h4>
                <div className="ui link list">
                  {_.map(this.filters.clones, (filter) => {
                    return (
                      <a className="item" key={filter.name}>
                        <div className="ui horizontal label small">
                          {numeral(this.state.sampleInfo.counts[filter.name].total).format('0a')}
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
                      <a className="item" key={filter.name}>
                        <div className="ui horizontal label small">
                          {numeral(this.state.sampleInfo.counts[filter.name].total).format('0a')}
                        </div>
                        {filter.label}
                      </a>
                    );
                  })}
                </div>
              </div>
						</div>
					</div>
          <div className="item">
            <div className="ui button right floated">Hide Partial Reads</div>
          </div>
          <div className="item">
            <div className="ui button right floated">Hide Outliers</div>
          </div>
				</div>

        <div className="ui form">
          <div className="field">
            <label>Plot By...</label>
            <select className="ui dropdown">
              <option>Sample</option>
              <option>Subject</option>
              <option>Tissue</option>
              <option>Subset</option>
              <option>Ig Class</option>
              <option>Disease</option>
            </select>
          </div>
        </div>
      </div>
    );
  }
}

export default SampleAnalysis;
