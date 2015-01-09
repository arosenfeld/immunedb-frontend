(function() {
    'use strict';
    angular.module('ImmunologyApp').controller('ExportCtrl', ['$scope',
            '$http', '$routeParams', '$log', 'APIService',
        function($scope, $http, $routeParams, $log, APIService) {
            var fasta_fields = [
                'seq_id',
                'sample_name',
                'copy_number',
                'clone_id',
            ];

            var tab_fields = [
                'seq_id',
                'subject_identifier',
                'subset',
                'tissue',
                'disease',
                'lab',
                'experimenter',
                'date',
                'sample_name',
                'study_name',
                'alignment',
                'in_frame',
                'functional',
                'stop',
                'copy_number',
                'num_gaps',
                'pad_length',
                'v_match',
                'v_length',
                'j_match',
                'j_length',
                'v_call',
                'j_call',
                'cdr3_nt',
                'cdr3_aa',
                'sequence_filled',
                'germline',
                'clone_id',
                'clone_cdr3_nt',
                'clone_cdr3_aa',
            ];

            $scope.formats = [
                {
                    'type': 'orig',
                    'text': 'FASTA Original',
                    'fields': tab_fields,
                },
                {
                    'type': 'fill',
                    'text': 'FASTA Germline Filled',
                    'fields': tab_fields,
                },
                {
                    'type': 'clip',
                    'text': 'FASTA CLIP',
                    'fields': tab_fields,
                },
                {
                    'type': 'tab',
                    'text': 'Tab Delimited',
                    'fields': tab_fields,
                },
            ];

            $scope.fields = [
                {
                    'header': 'seq_id',
                    'name': 'Sequence ID',
                    'desc': 'Unique identifier for the sequence within the sample.',
                },
                {
                    'header': 'identity_seq_id',
                    'name': 'Identity Sequence ID',
                    'desc': 'The <span class="text-mono-thin">seq_id</span> ' +
                    'which globally identifies this germline-filled sequence. ' +
                    'This can be useful when finding duplicate sequences across ' +
                    'samples.'
                },
                {
                    'header': 'duplicate_of_seq_id',
                    'name': 'Duplicate Sequence ID',
                    'desc': '<span class="text-mono-thin">seq_id</span> of the ' +
                    'sequence in the same sample to which the sequence was collapsed if any.  For ' +
                    'this to be useful, include duplicate sequences in the ' +
                    'export.  Duplicate sequences will have a ' +
                    '<span class="mono-text-thin">copy_number</span> of zero.',
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
                    'header': 'disease',
                    'name': 'Disease',
                    'desc': 'The disease(s), if any, in the subject from which the sequence originates.',
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
                    'header': 'alignment',
                    'name': 'Alignment Method',
                    'desc': 'The read number or alignment method for the sequence (R1, R2, pRESTO).',
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
                    'name': 'Exact Match Copy Number',
                    'desc': 'The number of reads in the same sample with the exact same sequence.',
                },
                {
                    'header': 'levenshtein_dist',
                    'name': 'Levenshtein Distance',
                    'desc': 'For misaligned or indel probable sequences, the <a '
                        + 'href="http://en.wikipedia.org/wiki/Levenshtein_distance" target="_blank">Levenshtein '
                        + 'distance</a> of the sequence to the germline.',
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
                    'header': 'v_call',
                    'name': 'V Gene',
                    'desc': 'The V gene assigned to the sequence.',
                },
                {
                    'header': 'j_call',
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
                    'header': 'clone_id',
                    'name': 'Clone ID',
                    'desc': 'The unique clone identifier for this sequence, if any.',
                },
                {
                    'header': 'clone_group_id',
                    'name': 'Clone Group ID',
                    'desc': 'The unique clone group identifier for the associated clone for correlating across '
                        + 'database versions.',
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
            ];

            $scope.clearFields = function() {
                $log.debug('clear');
                $scope.checked_fields = [];
            }

            $scope.changeType = function(format) {
                // Bug with checkbox plugin
                //$scope.checked_fields = angular.copy(format.fields);
                $scope.format = format.type;
                $scope.formatText = format.text;

                if (['orig', 'fill', 'clip'].indexOf(format.type) > -1) {
                    $scope.forceSeq = true;
                } else {
                    $scope.forceSeq = false;
                }
            }

            var init = function() {
                $scope.showLoader()
                $scope.checked_fields = angular.copy(tab_fields);
                $scope.format = null;
                $scope.$parent.page_title = 'Sequence Export';
                $scope.apiUrl = APIService.getUrl();

                $scope.type = $routeParams['type'].charAt(0).toUpperCase() +
                    $routeParams['type'].slice(1);
                $scope.id = $routeParams['id'];
                $scope.duplicates = false;
                $scope.noresults = false;
                $scope.min_copy_number = 1;

                $scope.hideLoader()
            }

            init();
        }
    ]);
})();