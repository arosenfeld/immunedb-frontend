import React from 'react';

export default class Sidebar extends React.Component {
  render() {
    return (
      <div className="ui fixed inverted menu">
        <div className="ui container">
          <div className="item inverted">
            <h4>SITE_TITLE</h4>
          </div>
          <a className="item" href="samples">
            Samples
          </a>
          <a className="item" href="sequences">
            Sequences
          </a>
          <a className="item" href="clones">
            Clones
          </a>
          <a className="item" href="subjects">
            Subjects
          </a>
        </div>
      </div>
    );
  }
}
