import React from 'react';
import {Link} from 'react-router';

import {ENDPOINT} from '../api';

export default class CloneExport extends React.Component {
  render() {
    return (
      <div>
        <h1>Export Clones</h1>
        <div className="ui teal segment">
          <h4>Options</h4>
          Select which clonal information to export:
					<div className="ui middle aligned divided list">
						<div className="item">
							<div className="right floated content">

                <div className="ui buttons">
                  <Link className="ui primary button"
                      to={{
                        pathname: 'download',
                        state: {endpoint: ENDPOINT + '/export/clones/summary'}
                      }}>
                    <i className="download icon"></i>
                    Excluding Lineages
                  </Link>
                  <div className="or"></div>
                  <Link className="ui primary button"
                      to={{
                        pathname: 'download',
                        state: {endpoint: ENDPOINT + '/export/clones/summary?lineages=true'}
                      }}>
                    <i className="download icon"></i>
                    Excluding Lineages
                  </Link>
                </div>

							</div>
							<div className="content">
								<strong>Clone Summary</strong>: <br />
								One row per clone. Provides information about V/J gene, CDR3, germline and
                clone size. <strong>Including lineages
                drastically increases file size.</strong><br />
							</div>
						</div>

						<div className="item">
							<div className="right floated content">
                <Link className="ui primary icon button compact"
                    to={{
                      pathname: 'download',
                      state: {endpoint: ENDPOINT + '/export/clones/overlap'}
                    }}>
                  <i className="download icon"></i>
                </Link>
							</div>
							<div className="content">
								<strong>Clone Overlap</strong>: <br />
								One row per clone/sample combination.  Provides information about
								which clones are present in which samples and to what extent.
							</div>
						</div>

						<div className="item">
							<div className="right floated content">
                <Link className="ui primary icon button compact"
                    to={{
                      pathname: 'download',
                      state: {endpoint: ENDPOINT + '/export/clones/vdjtools'}
                    }}>
                  <i className="download icon"></i>
                </Link>
							</div>
							<div className="content">
								<strong>VDJTools Format</strong>: <br />
                One file per sample, one row per clone combination.  Useful for
                generating plots with VDJTools.
							</div>
						</div>

						<div className="item">
							<div className="right floated content">
                <Link className="ui primary icon button compact"
                    to={{
                      pathname: 'download',
                      state: {endpoint: ENDPOINT + '/export/clones/selection'}
                    }}>
                  <i className="download icon"></i>
                </Link>
							</div>
							<div className="content">
								<strong>Selection Pressure</strong>: <br />
								One row per clone/sample/threshold combination.  Provides
								selection pressure information for each clone/sample.
							</div>
						</div>
					</div>

        </div>
      </div>
    );
  }
}
