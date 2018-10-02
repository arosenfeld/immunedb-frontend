import React from 'react';

import { Link } from 'react-router';

export default class Sidebar extends React.Component {
  componentDidMount() {
    $('.dropdown').dropdown({
    });
  }

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
					<div className="ui dropdown item">
            Download Dataset...
						<i className="dropdown icon"></i>
						<div className="menu">
							<Link className="item" to="export/clones">Clones</Link>
							<Link className="item" to="export/samples">Samples</Link>
							<Link className="item" to="export/sequences">Sequences</Link>
						</div>
					</div>
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
