import React from 'react';

import { Link } from 'react-router';

export default class Sidebar extends React.Component {
  render() {
    return (
      <div className="ui fixed inverted menu">
        <div className="ui container">
          <div className="item inverted">
            <h4>SITE_TITLE</h4>
          </div>
          <Link className="item" to="samples">
            Samples
          </Link>
          <Link className="item" to="sequences">
            Sequences
          </Link>
          <Link className="item" to="clones">
            Clones
          </Link>
          <Link className="item" to="subjects">
            Subjects
          </Link>
          <div className="right item borderless">
            <div className={'ui label' + ('VERSION' == 'develop' ? ' red' : ' teal')}>
              <span><i className="tag icon"></i> VERSION</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
