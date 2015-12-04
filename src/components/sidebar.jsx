import React from 'react';
import { Link } from 'react-router';

export default class Sidebar extends React.Component {
  render() {
    return (
      <div className="ui fixed inverted menu">
        <div className="ui container">
          <div className="item inverted">
            <h4>SimLab Database</h4>
          </div>
          <Link className="item" to="/samples">
            Samples
          </Link>
          <Link className="item" to="/sequences">
            Sequences
          </Link>
          <Link className="item" to="/clones">
            Clones
          </Link>
          <Link className="item" to="/subjects">
            Subjects
          </Link>
        </div>
      </div>
    );
  }
}
