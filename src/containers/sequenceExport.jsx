import React from 'react';

import ExportFields from '../components/exportFields';

import {ENDPOINT} from '../api';

export default class SequenceExport extends React.Component {
  static FIELDS = [
		{
				'header': 'seq_id',
				'name': 'Sequence ID',
				'desc': 'Unique identifier for the sequence within the sample.',
		},
		{
				'header': 'subject_id',
				'name': 'Subject ID',
				'desc': 'The subject ID as it appears in the database.',
		},
		{
				'header': 'subject_identifier',
				'name': 'Subject Identifier',
				'desc': 'The subject ID as defined by the experimenter.',
		},
		{
				'header': 'subset',
				'name': 'Subset',
				'desc': 'The cell subset of the sequence.',
		},
		{
				'header': 'tissue',
				'name': 'Tissue',
				'desc': 'The tissue from which the sequence originates.',
		},
		{
				'header': 'ig_class',
				'name': 'Ig Class',
				'desc': 'The immunoglobulin class of the sequences.',
		},
		{
				'header': 'disease',
				'name': 'Disease',
				'desc': 'The disease(s), if any, in the subject from which the sequence originates.',
		},
		{
				'header': 'v_primer',
				'name': 'V Gene Primer',
				'desc': 'V gene primer information',
		},
		{
				'header': 'j_primer',
				'name': 'J Gene Primer',
				'desc': 'J gene primer information',
		},
		{
				'header': 'lab',
				'name': 'Lab',
				'desc': 'The lab which acquired the sequence.',
		},
		{
				'header': 'experimenter',
				'name': 'Experimenter',
				'desc': 'The individual who acquired the sequence.',
		},
		{
				'header': 'date',
				'name': 'Date',
				'desc': 'The date the sequence was acquired (YYYY-MM-DD).',
		},
		{
				'header': 'sample_id',
				'name': 'Sample ID',
				'desc': 'The ID of the sample as it appears in the database.',
		},
		{
				'header': 'sample_name',
				'name': 'Sample Name',
				'desc': 'The name of the sample.',
		},
		{
				'header': 'study_id',
				'name': 'Study ID',
				'desc': 'The ID of the study as it appears in the database.',
		},
		{
				'header': 'study_name',
				'name': 'Study Name',
				'desc': 'The name of the study.',
		},
		{
				'header': 'paired',
				'name': 'Paired Read',
				'desc': 'If the sequence is constructed from paired-end reads.',
		},
		{
				'header': 'in_frame',
				'name': 'In Frame',
				'desc': 'If the sequence\'s length is a multiple of three.',
		},
		{
				'header': 'functional',
				'name': 'Functional',
				'desc': 'If the sequence\'s length is a multiple of three and contains no stop codons.',
		},
		{
				'header': 'stop',
				'name': 'Stop Codons',
				'desc': 'If the sequence contains stop codons.',
		},
		{
				'header': 'copy_number',
				'name': 'Copy Number',
				'desc': 'The number of reads in the same sample with the same sequence.',
		},
		{
				'header': 'probable_indel_or_misalign',
				'name': 'Insertion/Deletion or Poor Alignment',
				'desc': 'A boolean flag if the sequence likely contains an ' +
								'insertion/deletion or is not well aligned.'
		},
		{
				'header': 'num_gaps',
				'name': 'Number of Gaps',
				'desc': 'Number of V-gene gaps inserted based on <a '
						+ 'href="http://www.imgt.org/IMGTScientificChart/Numbering/IMGTnumbering.html" '
						+ 'target="_blank">IMGT numbering</a>.',
		},
		{
				'header': 'pad_length',
				'name': 'Number of Padded Bases',
				'desc': 'Number of unknown bases (Ns) added to the beginning of the sequence to align it to the germline.',
		},
		{
				'header': 'v_match',
				'name': 'V Bases Matching Germline',
				'desc': 'Total number of bases in the V-gene matching the germline, excluding gaps.',
		},
		{
				'header': 'v_length',
				'name': 'V Length',
				'desc': 'Total number of bases in the V-gene, excluding gaps.',
		},
		{
				'header': 'j_match',
				'name': 'J Bases Matching Germline',
				'desc': 'Total number of bases in the J-gene matching the germline, excluding gaps.',
		},
		{
				'header': 'j_length',
				'name': 'J Length',
				'desc': 'Total number of bases in the J-gene, excluding gaps.',
		},
		{
				'header': 'v_gene',
				'name': 'V Gene',
				'desc': 'The V gene assigned to the sequence.',
		},
		{
				'header': 'j_gene',
				'name': 'J Gene',
				'desc': 'The J gene assigned to the sequence.',
		},
		{
				'header': 'cdr3_nt',
				'name': 'CDR3 Nucleotides',
				'desc': 'The bases comprising the CDR3.',
		},
		{
				'header': 'cdr3_aa',
				'name': 'CDR3 Amino Acids',
				'desc': 'The amino acids comprising the CDR3.  Out of frame bases are ignored.',
		},
		{
				'header': 'cdr3_num_nts',
				'name': 'CDR3 Length (in NTs)',
				'desc': 'Number of bases in the CDR3',
		},
		{
				'header': 'gap_method',
				'name': 'Gapping Method',
				'desc': 'The method used for gapping V sequenes to equal length.',
		},
		{
				'header': 'pre_cdr3_match',
				'name': 'Pre-CDR3 V Gene Match',
				'desc': 'Total number of bases in the V-gene matching the germline, excluding gaps, before the CDR3.',
		},
		{
				'header': 'pre_cdr3_length',
				'name': 'Pre-CDR3 V Gene Length',
				'desc': 'Total number of bases in the V-gene, excluding gaps, before the CDR3.',
		},
		{
				'header': 'post_cdr3_match',
				'name': 'Post-CDR3 J Gene Match',
				'desc': 'Total number of bases in the J-gene matching the germline after the CDR3.',
		},
		{
				'header': 'post_cdr3_length',
				'name': 'Post-CDR3 J Gene Length',
				'desc': 'Total number of bases in the J-gene after the CDR3.',
		},
		{
				'header': 'sequence_filled',
				'name': 'Full Sequence',
				'desc': 'The full sequence with padding replaced with germline bases.',
		},
		{
				'header': 'sequence',
				'name': 'Full Sequence',
				'desc': 'The full sequence including any padding from alignment.',
		},
		{
				'header': 'germline',
				'name': 'Sequence Germline',
				'desc': 'The germline sequence with gaps inserted for the CDR3.',
		},
		{
				'header': 'quality',
				'name': 'Phred Quality',
				'desc': 'The Phred quality score per-nucleotide in Sanger format',
		},
		{
				'header': 'clone_id',
				'name': 'Clone ID',
				'desc': 'The unique clone identifier for this sequence, if any.',
		},
		{
				'header': 'clone_cdr3_nt',
				'name': 'Clone Consensus CDR3 Nucleotides',
				'desc': 'The nucleotides comprising the associated clone\'s consensus CDR3.',
		},
		{
				'header': 'clone_cdr3_aa',
				'name': 'Clone Consensus CDR3 Amino Acids',
				'desc': 'The amino acids comprising the associated clone\'s consensus CDR3.',
		},
		{
				'header': 'clone_json_tree',
				'name': 'Clone Tree',
				'desc': 'The clone lineage tree represented in JSON.  Note that including this field can '
						+ 'drastically increase file size',
		},
		{
				'header': 'collapse_to_subject_seq_id',
				'name': 'Sequence ID Collapsed-to at Subject Level',
				'desc': 'The <span className="text-mono-thin">seq_id</span> to which the sequence was collapsed '
						+ 'at the subject level.'
		},
		{
				'header': 'collapse_to_subject_sample_id',
				'name': 'Sequence Sample Collapsed-to at Subject Level',
				'desc': 'The <span className="text-mono-thin">sample_id</span> to which the sequence was collapsed '
						+ 'at the subject level.'
		},
	];

  constructor() {
    super();
    this.state = {
      format: null,
      fields: []
    };
  }

  componentDidMount() {
    $('#format-select').dropdown({
      action: 'hide',
      onChange: (value, text) => {
        this.setState({
          format: value
        }, this.doExport);
      }
    });
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
      <div id="format-select" className={
        'ui dropdown labeled icon primary button right floated' + (this.state.fields.length == 0 ? ' disabled' : '')
      }>
        <i className="file outline icon"></i>
        <div className="text">Export</div>
        <div className="menu">
          <div className="item" data-value="csv">CSV</div>
          <div className="item" data-value="fasta-orig">FASTA</div>
          <div className="item" data-value="fasta-fill">FASTA Germline Filled</div>
          <div className="item" data-value="fastq-orig">FASTQ</div>
          <div className="item" data-value="fastq-fill">FASTQ Germline Filled</div>
          <div className="item" data-value="clip-orig">CLIP</div>
          <div className="item" data-value="clip-fill">CLIP Germline Filled</div>
        </div>
      </div>
    );

    return (
      <div>
        <h1>Export Sequences</h1>
        <div className="ui teal segment">
          <iframe name="download-frame" style={{display: 'none'}}></iframe>
          <form method="POST" action={ENDPOINT + '/export/sequences/sample/' + this.props.params.encoding}
                id="download-form" target="download-frame">
            <input type="hidden" name="format" value={this.state.format} />
            <input type="hidden" name="fields" value={this.state.fields} />
            <h4>Options</h4>
            <div className="ui form">
              <div className="field">
                <div className="ui checkbox">
                  <input type="checkbox" name="subject_uniques"/>
                  <label>Include only sequences unique to each subject</label>
                </div>
              </div>
              <div className="field">
                <div className="ui checkbox">
                  <input type="checkbox" name="only_with_clones" />
                  <label>Include only sequences assigned to a clone</label>
                </div>
              </div>
            </div>

            <h4>Fields</h4>
            <ExportFields fields={SequenceExport.FIELDS} exportButton={exportButton}
                          onFieldChange={this.fieldsChanged} />
          </form>
        </div>
      </div>
    );
  }
}
