import React from 'react';

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
                  <a href={ENDPOINT + '/export/clones/summary'}
                     className="ui primary button">
                    <i className="download icon"></i>
                    Excluding Lineages
                  </a>
                  <div className="or"></div>
                  <a href={ENDPOINT + '/export/clones/summary?lineages=true'}
                     className="ui primary button">
                    <i className="download icon"></i>
                    Including Lineages
                  </a>
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
								<a href={ENDPOINT + '/export/clones/overlap'} target="_blank"
									 className="ui primary icon button compact">
									<i className="download icon"></i>
								</a>
							</div>
							<div className="content">
								<strong>Clone Overlap</strong>: <br />
								One row per clone/sample combination.  Provides information about
								which clones are present in which samples and to what extent.
							</div>
						</div>

						<div className="item">
							<div className="right floated content">
								<a href={ENDPOINT + '/export/clones/vdjtools'} target="_blank"
									 className="ui primary icon button compact">
									<i className="download icon"></i>
								</a>
							</div>
							<div className="content">
								<strong>VDJTools Format</strong>: <br />
                One file per sample, one row per clone combination.  Useful for
                generating plots with VDJTools.
							</div>
						</div>

						<div className="item">
							<div className="right floated content">
								<a href={ENDPOINT + '/export/clones/selection'} target="_blank"
									 className="ui primary icon button compact">
									<i className="download icon"></i>
								</a>
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
