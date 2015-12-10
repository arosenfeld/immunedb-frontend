import React from 'react';

import ExportFields from '../components/exportFields';

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
      header: 'tissue',
      name: 'Tissue',
      desc: 'The tissue from which the sample was taken.',
    },
    {
      header: 'subset',
      name: 'Subset',
      desc: 'The cell subset of the sample.',
    },
    {
      header: 'ig_class',
      name: 'Ig Class',
      desc: 'The class of the sequence (e.g. IgA, IgG).',
    },
    {
      header: 'j_primer',
      name: 'J Gene Primer',
      desc: 'The J-gene primer used.',
    },
    {
      header: 'v_primer',
      name: 'V Gene Primer',
      desc: 'The V-gene primer used.',
    },
    {
      header: 'disease',
      name: 'Disease',
      desc: 'The disease(s), if any, in the subject from which the sample originates.',
    },
    {
      header: 'lab',
      name: 'Lab',
      desc: 'The lab which acquired the sample.',
    },
    {
      header: 'experimenter',
      name: 'Experimenter',
      desc: 'The individual who acquired the sample.',
    },
    {
      header: 'date',
      name: 'Date',
      desc: 'The date the sample was acquired (YYYY-MM-DD).',
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