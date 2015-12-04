import React from 'react';

import { colorAAs } from '../utils';
import { Link } from 'react-router';

import API from '../api';
import GeneCollapser from './geneCollapser';
import Message from './message';

export default class SequenceList extends React.Component {
  constructor() {
    super();
    this.state = {
      asyncState: 'loading',

      page: 1,

      filter: {},
      showFilters: false,

      samples: [],
      sequences: []
    };
    this.onChange = _.debounce(this.onChange, 10);
  }

  componentDidMount() {
    this.setState({asyncState: 'loading'});
    API.post('samples/list').end((err, response) => {
      if (err) {
        this.setState({asyncState: 'error'});
      } else {
        this.setState({
          asyncState: 'loaded',
          samples: response.body
        });
      }
    });
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
    API.post('sequences/list', {
      page: this.state.page,
      filters: this.state.filter,
    }).end((err, response) => {
      if (err) {
        this.setState({asyncState: 'error'});
      } else {
        this.setState({
          asyncState: 'loaded',
          sequences: response.body
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
    this.setState({
      page: 1
    }, this.update);
  }

  onChange = (e) => {
    let isInt = _.contains(['cdr3_num_nts', 'min_copy_number', 'max_copy_number'], e.target.name);
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
              <label>Seq ID</label>
              <input type="text" name="seq_id" placeholder="Use % as a wildcard" defaultValue={this.state.filter.seq_id} onChange={this.onChange} />
            </div>
            <div className="field">
              <label>Sample</label>
              <select className="ui search sample_id dropdown" defaultValue={this.state.filter.sample_id}>
                <option value="">Sample</option>
                <option value=" ">All</option>
                {_.map(this.state.samples, (sample) => {
                  return <option
                          value={sample.id} key={sample.id}>{sample.name} (# {sample.id})</option>
                })}
              </select>
            </div>
          </div>
          <div className="fields">
            <div className="three wide field">
              <label>V Gene</label>
              <input type="text" name="v_gene" placeholder="Use % as a wildcard" defaultValue={this.state.filter.v_gene} onChange={this.onChange} />
            </div>
            <div className="three wide field">
              <label>J Gene</label>
              <input type="text" name="j_gene" placeholder="Use % as a wildcard" defaultValue={this.state.filter.j_gene} onChange={this.onChange} />
            </div>
            <div className="three wide field">
              <label>CDR3 Length (in nucleotides)</label>
              <input type="number" name="cdr3_num_nts" min="1" defaultValue={this.state.filter.cdr3_num_nts} onChange={this.onChange} />
            </div>
          </div>
          <div className="fields">
            <div className="two wide field">
              <label>Min. Copy Number</label>
              <input type="number" name="min_copy_number" min="1" defaultValue={this.state.filter.min_copy_number} onChange={this.onChange} />
            </div>
            <div className="two wide field">
              <label>Max. Copy Number</label>
              <input type="number" name="max_copy_number" min="1" defaultValue={this.state.filter.max_copy_number} onChange={this.onChange} />
            </div>
            <div className="field">
              <label>Copy Number Field</label>
              <select className="ui copy_type dropdown" defaultValue={this.state.filter.copy_type || 'sample'}>
                <option value="">Min/max copies in...</option>
                <option value="sample">Sample</option>
                <option value="subject">Subject</option>
              </select>
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

  render() {
    if (this.state.asyncState == 'loading') {
      return <Message type='' icon='notched circle loading' header='Loading'
              message='Gathering sequence information' />;
    } else if (this.state.asyncState == 'error') {
      return <Message type='error' icon='warning sign' header='Error'
              message='Unable to fetch sequence information' />;
    }

    return (
      <div>
        <h1>Sequences</h1>
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
        <table className="ui single line teal table">
          <thead>
            <tr>
              <th>Sequence ID<i className="help icon popup" data-title="Sequence ID"
                data-content="The sample-unique identifier for the sequence"></i></th>
              <th>Subject<i className="help icon popup" data-title="Subject"
                data-content="The subject from which the sequence originated"></i></th>
              <th>V Gene <i className="help icon popup" data-title="V Gene"
                data-content="The variable gene associated with the sequence"></i></th>
              <th>J Gene <i className="help icon popup" data-title="J Gene"
                data-content="The joining gene associated with the sequence"></i></th>
              <th>CDR3 Length <i className="help icon popup" data-title="CDR3 Length"
                data-content="The length of the CDR3 in nucleotides"></i></th>
              <th>CDR3 AA <i className="help icon popup" data-title="CDR3 AA"
                data-content="The amino acids in the CDR3"></i></th>
              <th>Functional <i className="help icon popup" data-title="Functional"
                data-content="If the sequence produces a productive protein"></i></th>
              <th>Copy Number <i className="help icon popup" data-title="Copy Number"
                data-content="The copy number of the sequence in its sample / subject"></i></th>
              <th>Instances <i className="help icon popup" data-title="Instances"
                data-content="The number of independent times this sequence was found"></i></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {_.map(this.state.sequences, (sequence) => {
              return (
                <tr key={sequence.seq_id}>
                  <td>{sequence.seq_id}</td>
                  <td>{sequence.sample.subject.identifier}</td>
                  <td>
                    <GeneCollapser gene={sequence.v_gene} />
                  </td>
                  <td>
                    <GeneCollapser gene={sequence.j_gene} />
                  </td>
                  <td>{sequence.cdr3_num_nts}</td>
                  <td className="text-mono sequence">{colorAAs(sequence.cdr3_aa)}</td>
                  <td>{sequence.functional ? 'Yes' : 'No'}</td>
                  <td>{sequence.copy_number} / {sequence.copy_number_in_subject}</td>
                  <td>{sequence.instances_in_subject}</td>
                  <td>
                    <a href={'/sequence/' + sequence.sample.id + '/' + sequence.seq_id} target="_blank">
                      View <i className="angle right icon"></i>
                    </a>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

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

export default SequenceList;
