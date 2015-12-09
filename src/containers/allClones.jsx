import numeral from 'numeral';

import React from 'react';
import { Link } from 'react-router';

import API from '../api';
import CloneList from '../components/cloneList';
import GeneCollapser from '../components/geneCollapser';
import Message from '../components/message';
import { colorAAs } from '../utils';

export default class AllClones extends React.Component {
  constructor() {
    super();
    this.state = {
      asyncState: 'loading',

      page: 1,

      filter: {},
      showFilters: false,

      clones: []
    };
    this.onChange = _.debounce(this.onChange, 10);
  }

  componentDidMount() {
    this.update();
  }

  componentDidUpdate() {
    $('.sample_id .dropdown').dropdown({
      onChange: (value, text, $selectedItem) => {
        let filter = _.extend({}, this.state.filter);
        filter.sample_id = value;
        this.setState({
          filter
        });
      }
    });
    $('.copy_type .dropdown').dropdown({
      onChange: (value, text, $selectedItem) => {
        let filter = _.extend({}, this.state.filter);
        filter.copy_type = value;
        this.setState({
          filter
        });
      }
    });

    $('.popup').popup({
      position: 'bottom left'
    });
  }

  nextPage = () => {
    this.setState({
      page: this.state.page + 1
    }, this.update);
  }

  prevPage = () => {
    this.setState({
      page: Math.max(0, this.state.page - 1)
    }, this.update);
  }

  update = () => {
    API.post('clones/list', {
      page: this.state.page,
      filters: this.state.filter,
    }).end((err, response) => {
      if (err) {
        this.setState({asyncState: 'error'});
      } else {
        this.setState({
          asyncState: 'loaded',
          clones: response.body
        });
      }
    });
  }

  toggleFilters = (e) => {
    e.preventDefault();
    this.setState({
      showFilters: !this.state.showFilters
    });
  }

  filter = (e) => {
    e.preventDefault();
    this.update();
  }

  onChange = (e) => {
    let isInt = _.contains(['id', 'min_cdr3_num_nts', 'max_cdr3_num_nts',
                            'min_unique', 'max_unique'], e.target.name);
    let change = _.extend({}, this.state.filter, {
      [e.target.name]: isInt ? parseInt(e.target.value) : e.target.value
    });
    _.each(change, (v, k) => {
      if (!v || v.length === 0) {
        delete change[k];
      }
    });
    this.setState({filter: change});
  }

  filterForm = () => {
    return (
      <div className="ui teal segment">
        <h3>Filters</h3>
        <form className="ui form">
          <div className="fields">
            <div className="field">
              <label>ID</label>
              <input type="number" name="id" defaultValue={this.state.filter.id} onChange={this.onChange} />
            </div>
            <div className="three wide field">
              <label>V Gene</label>
              <input type="text" name="v_gene" placeholder="Use % as a wildcard" defaultValue={this.state.filter.v_gene} onChange={this.onChange} />
            </div>
            <div className="three wide field">
              <label>J Gene</label>
              <input type="text" name="j_gene" placeholder="Use % as a wildcard" defaultValue={this.state.filter.j_gene} onChange={this.onChange} />
            </div>
          </div>
          <div className="fields">
            <div className="three wide field">
              <label>Min. CDR3 Length (in nucleotides)</label>
              <input type="number" name="min_cdr3_num_nts" min="1" defaultValue={this.state.filter.min_cdr3_num_nts} onChange={this.onChange} />
            </div>
            <div className="three wide field">
              <label>Max. CDR3 Length (in nucleotides)</label>
              <input type="number" name="max_cdr3_num_nts" min="1" defaultValue={this.state.filter.max_cdr3_num_nts} onChange={this.onChange} />
            </div>
          </div>
          <button className="ui button" onClick={this.filter}>Filter</button>
          <button className="ui right labeled icon primary button" onClick={this.toggleFilters}>
            <i className="filter icon"></i>
            Hide Filters
          </button>
        </form>
      </div>
    );
  }

  getCloneRows = (clone) => {
    let rows = [
      <tr key={clone.id + '_info'}>
        <td>{clone.id}</td>
        <td>{clone.subject.identifier}</td>
        <td>
          <GeneCollapser gene={clone.v_gene} />
        </td>
        <td>
          <GeneCollapser gene={clone.j_gene} />
        </td>
        <td>{clone.cdr3_num_nts}</td>
        <td className="text-mono sequence">{colorAAs(clone.cdr3_aa)}</td>
        <td>{numeral(clone.unique_sequences).format('0,0')}</td>
        <td>{numeral(clone.total_sequences).format('0,0')}</td>
        <td>
          <a href={'/clone/' + clone.id} target="_blank">
            View <i className="angle right icon"></i>
          </a>
        </td>
      </tr>,
      <tr key={clone.id + '_stats'}>
        <td></td>
        <td colSpan="8">
          <div className="ui red segment">
            <h4>Sample Breakdown</h4>
            <table className="ui compact table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Unique Seqs.</th>
                  <th>Total Seqs.</th>
                </tr>
              </thead>
              <tbody>
                {_.map(clone.stats, (stat) => {
                  return (
                    <tr key={stat.sample.id}>
                      <td>{stat.sample.id}</td>
                      <td><Link to={'/sample/' + stat.sample.id}>{stat.sample.name}</Link></td>
                      <td>{numeral(stat.unique_sequences).format('0,0')}</td>
                      <td>{numeral(stat.total_sequences).format('0,0')}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </td>
      </tr>
    ];
    return rows;
  }

  render() {
    if (this.state.asyncState == 'loading') {
      return <Message type='' icon='notched circle loading' header='Loading'
              message='Gathering clone information' />;
    } else if (this.state.asyncState == 'error') {
      return <Message type='error' icon='warning sign' header='Error'
              message='Unable to fetch clone information' />;
    }

    return (
      <div>
        <h1>Clones</h1>
        {
          !this.state.showFilters ?
            <button className="ui right labeled icon primary button" onClick={this.toggleFilters}>
              <i className="filter icon"></i>
              Show Filters
            </button>
          :
            ''
        }
        {this.state.showFilters ? this.filterForm() : ''}

        <CloneList clones={this.state.clones} />

        <div className="ui one column stackable center aligned page grid">
          <div className="column twelve wide">
            <button className="ui labeled icon button" onClick={this.prevPage} disabled={this.state.page == 1}>
              <i className="left chevron icon"></i>
              Previous
            </button>
            <button className="ui right labeled icon button" onClick={this.nextPage}>
              Next
              <i className="right chevron icon"></i>
            </button>
          </div>
        </div>
      </div>
    );
  }
}
