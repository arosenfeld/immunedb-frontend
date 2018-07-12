import React from 'react';

import {ENDPOINT} from '../api';

export default class CloneExport extends React.Component {
  static FIELDS = [
    {
      header: 'clone_id',
      name: 'Clone ID',
      desc: 'The unique clone identifier.',
      force: true
    },
    {
      header: 'sample_id',
      name: 'Sample ID',
      desc: 'The ID of the sample as it appears in the database.',
      force: true
    },
    {
      header: 'unique_sequences',
      name: 'Unique Sequence Count',
      desc: 'The number of unique sequences in the sample for ' +
      ' the given clone',
      force: true
    },
    {
      header: 'total_sequences',
      name: 'Total Sequence Count',
      desc: 'The number of total sequences in the sample for ' +
      ' the given clone',
      force: true
    },
    {
      header: 'parent_id',
      name: 'Parent ID',
      desc: 'The ID of the parent clone, if any'
    },
    {
      header: 'v_gene',
      name: 'V Gene',
      desc: 'The V gene assigned to the clone.',
    },
    {
      header: 'j_gene',
      name: 'J Gene',
      desc: 'The J gene assigned to the clone.',
    },
    {
      header: 'cdr3_nt',
      name: 'CDR3 Nucleotides',
      desc: 'The bases comprising the consensus CDR3.',
    },
    {
      header: 'cdr3_aa',
      name: 'CDR3 Amino Acids',
      desc: 'The amino acids comprising the consensus CDR3.  Out of frame bases are ignored.',
    },
    {
      header: 'cdr3_num_nts',
      name: 'CDR3 Length (in NTs)',
      desc: 'Number of bases in the CDR3',
    },
    {
      header: 'insertions',
      name: 'Insertions',
      desc: 'A list of (position, length) pairs for insertions.',
    },
    {
      header: 'deletions',
      name: 'Deletions',
      desc: 'A list of (position, length) pairs for deletions.',
    },
    {
      header: 'functional',
      name: 'Functional',
      desc: 'If the clone\'s CDR3 length is a multiple of three and contains no stop codons.',
    },
    {
      header: 'sample_name',
      name: 'Sample Name',
      desc: 'The name of the sample.',
    },
    {
      header: 'subject_id',
      name: 'Subject ID',
      desc: 'The subject ID as it appears in the database.',
    },
    {
      header: 'subject_identifier',
      name: 'Subject Identifier',
      desc: 'The subject ID as defined by the experimenter.',
    },
    {
      header: 'tree',
      name: 'Lineage Tree',
      desc: 'The clone lineage tree represented in JSON.  Note that including this field can '
      + 'drastically increase file size',
    }
  ];

  constructor() {
    super();
    this.state = {
      fields: []
    };
  }

  fieldsChanged = (fields) => {
    this.setState({
      fields
    });
  }

  doExport = () => {
    $('#download-form').submit();
  }

  render() {
    let exportButton = (
      <button className="ui labeled icon primary button right floated">
        <i className="file outline icon"></i>
        Download
      </button>
    );

    return (
      <div>
        <h1>Export Clones</h1>
        <div className="ui teal segment">
          <h4>Fields</h4>
          <form method="POST" action={ENDPOINT + '/export/clones/' + this.props.params.type + '/' + this.props.params.encoding}
                id="download-form" target="download-frame">
            <input type="hidden" name="fields" value={this.state.fields} />
            <ExportFields fields={CloneExport.FIELDS} exportButton={exportButton}
                          onFieldChange={this.fieldsChanged} />
          </form>
          <iframe name="download-frame" style={{display: 'none'}}></iframe>
        </div>
      </div>
    );
  }
}
