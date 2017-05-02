import numeral from 'numeral';

import React from 'react';
import { Link } from 'react-router';

import API from '../api';
import Message from './message';

export default class SubjectList extends React.Component {
  constructor() {
    super();
    this.state = {
      asyncState: 'loading',

      page: 1,

      subjects: []
    };
  }

  componentDidMount() {
    this.update();
  }

  componentDidUpdate() {
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
    API.post('subjects/list', {
      page: this.state.page,
    }).end((err, response) => {
      if (err) {
        this.setState({asyncState: 'error'});
      } else {
        this.setState({
          asyncState: 'loaded',
          subjects: response.body
        });
      }
    });
  }

  render() {
    if (this.state.asyncState == 'loading') {
      return <Message type='' icon='notched circle loading' header='Loading'
              message='Gathering subject information' />;
    } else if (this.state.asyncState == 'error') {
      return <Message type='error' icon='warning sign' header='Error'
              message='Unable to fetch subject information' />;
    }

    return (
      <div>
        <h1>Subjects</h1>
        <table className="ui single line teal table">
          <thead>
            <tr>
              <th>ID <i className="help icon popup" data-title="ID"
                data-content="The unique ID for the subject in the database"></i></th>
              <th>Study <i className="help icon popup" data-title="Study"
                data-content="The study in which the subject was sampled"></i></th>
              <th>Identifier <i className="help icon popup" data-title="Identifier"
                data-content="The identifier given to the subject"></i></th>
              <th>Unique Sequences <i className="help icon popup" data-title="Unique Sequences"
                data-content="The total unique sequences found in the subject's samples"></i></th>
              <th>Clones <i className="help icon popup" data-title="Clones"
                data-content="The total clones found in the subject"></i></th>
              <th>Samples <i className="help icon popup" data-title="Samples"
                data-content="The number of samples from the subject"></i></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {_.map(this.state.subjects, (subject) => {
              return (
                <tr key={subject.id}>
                  <td>{subject.id}</td>
                  <td>{subject.study.name}</td>
                  <td>{subject.identifier}</td>
                  <td>{numeral(subject.unique_seqs).format('0,0')}</td>
                  <td>{numeral(subject.total_clones).format('0,0')}</td>
                  <td>{numeral(subject.total_samples).format('0,0')}</td>
                  <td>
                    <Link to={'subject/' + subject.id} target="_blank">
                      View <i className="angle right icon"></i>
                    </Link>
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
