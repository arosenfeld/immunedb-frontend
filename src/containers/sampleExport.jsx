import React from 'react';
import {Link} from 'react-router';

import {ENDPOINT} from '../api';

export default class SampleExport extends React.Component {
  render() {
    return (
      <div>
        <h1>Export Samples &amp; Metadata</h1>
        <div className="ui teal segment">
        This will download a TSV of all the samples in the database along with
        their sequence counts and metadata.
        <p>
          <Link className="ui primary button"
              to={{
                pathname: 'download',
                state: {endpoint: ENDPOINT + '/export/samples'}
              }}>
            <i className="download icon"></i>
            Download Sample Metadata
          </Link>
        </p>
        </div>
      </div>
    );
  }
}
