(function() {
    'use strict';
    angular.module('ImmunologyApp').controller('MasterTableCtrl', ['$scope',
            '$http', '$routeParams', '$log', 'APIService',
        function($scope, $http, $routeParams, $log, APIService) {
            $scope.fields = [
                {
                    'header': 'seq_id',
                    'name': 'Sequence ID',
                    'desc': 'Unique identifier for the sequence within the sample.',
                    'on': true,
                },
                {
                    'header': 'subject_id',
                    'name': 'Subject ID',
                    'desc': 'The subject ID as it appears in the database.',
                    'on': false,
                },
                {
                    'header': 'subject_identifier',
                    'name': 'Subject Identifier',
                    'desc': 'The subject ID as defined by the experimentor.',
                    'on': true,
                },
                {
                    'header': 'subset',
                    'name': 'Subset',
                    'desc': 'The cell subset of the sequence.',
                    'on': true,
                },
                {
                    'header': 'tissue',
                    'name': 'Tissue',
                    'desc': 'The tissue from which the sequence originates.',
                    'on': true,
                },
                {
                    'header': 'disease',
                    'name': 'Disease',
                    'desc': 'The disease(s), if any, in the subject from which the sequence originates.',
                    'on': true,
                },
                {
                    'header': 'lab',
                    'name': 'Lab',
                    'desc': 'The lab which acquired the sequence.',
                    'on': true,
                },
                {
                    'header': 'experimentor',
                    'name': 'Experimentor',
                    'desc': 'The individual who acquired the sequence.',
                    'on': true,
                },
                {
                    'header': 'date',
                    'name': 'Date',
                    'desc': 'The date the sequence was acquired (YYYY-MM-DD).',
                    'on': true,
                },
                {
                    'header': 'sample_id',
                    'name': 'Sample ID',
                    'desc': 'The ID of the sample as it appears in the database.',
                    'on': false,
                },
                {
                    'header': 'sample_name',
                    'name': 'Sample Name',
                    'desc': 'The name of the sample.',
                    'on': true,
                },
                {
                    'header': 'study_id',
                    'name': 'Study ID',
                    'desc': 'The ID of the study as it appears in the database.',
                    'on': false,
                },
                {
                    'header': 'study_name',
                    'name': 'Study Name',
                    'desc': 'The name of the study.',
                    'on': true,
                },
                {
                    'header': 'alignment',
                    'name': 'Alignment Method',
                    'desc': 'The read number or alignment method for the sequence (R1, R2, pRESTO).',
                    'on': true,
                },
                {
                    'header': 'in_frame',
                    'name': 'In Frame',
                    'desc': 'If the sequence\'s length is a multiple of three.',
                    'on': true,
                },
                {
                    'header': 'functional',
                    'name': 'Functional',
                    'desc': 'If the sequence\'s length is a multiple of three and contains no stop codons.',
                    'on': true,
                },
                {
                    'header': 'stop',
                    'name': 'Stop Codons',
                    'desc': 'If the sequence contains stop codons.',
                    'on': true,
                },
                {
                    'header': 'copy_number',
                    'name': 'Exact Match Copy Number',
                    'desc': 'The number of reads in the same sample with the exact same sequence.',
                    'on': true,
                },
                {
                    'header': 'levenshtein_dist',
                    'name': 'Levenshtein Distance',
                    'desc': 'For misaligned or indel probable sequences, the <a '
                        + 'href="http://en.wikipedia.org/wiki/Levenshtein_distance" target="_blank">Levenshtein '
                        + 'distance</a> of the sequence to the germline.',
                    'on': false,
                },
                {
                    'header': 'num_gaps',
                    'name': 'Number of Gaps',
                    'desc': 'Number of V-gene gaps inserted based on <a '
                        + 'href="http://www.imgt.org/IMGTScientificChart/Numbering/IMGTnumbering.html" '
                        + 'target="_blank">IMGT numbering</a>.',
                    'on': true,
                },
                {
                    'header': 'pad_length',
                    'name': 'Number of Padded Bases',
                    'desc': 'Number of unknown bases (Ns) added to the beginning of the sequence to align it to the germline.',
                    'on': true,
                },
                {
                    'header': 'v_match',
                    'name': 'V Bases Matching Germline',
                    'desc': 'Total number of bases in the V-gene matching the germline, excluding gaps.',
                    'on': true,
                },
                {
                    'header': 'v_length',
                    'name': 'V Length',
                    'desc': 'Total number of bases in the V-gene, excluding gaps.',
                    'on': true,
                },
                {
                    'header': 'j_match',
                    'name': 'J Bases Matching Germline',
                    'desc': 'Total number of bases in the J-gene matching the germline, excluding gaps.',
                    'on': true,
                },
                {
                    'header': 'j_length',
                    'name': 'J Length',
                    'desc': 'Total number of bases in the J-gene, excluding gaps.',
                    'on': true,
                },
                {
                    'header': 'v_call',
                    'name': 'V Gene',
                    'desc': 'The V gene assigned to the sequence.',
                    'on': true,
                },
                {
                    'header': 'j_call',
                    'name': 'J Gene',
                    'desc': 'The J gene assigned to the sequence.',
                    'on': true,
                },
                {
                    'header': 'cdr3_nt',
                    'name': 'CDR3 Nucleotides',
                    'desc': 'The bases comprising the CDR3.',
                    'on': true,
                },
                {
                    'header': 'cdr3_aa',
                    'name': 'CDR3 Amino Acids',
                    'desc': 'The amino acids comprising the CDR3.  Out of frame bases are ignored.',
                    'on': true,
                },
                {
                    'header': 'gap_method',
                    'name': 'Gapping Method',
                    'desc': 'The method used for gapping V sequenes to equal length.',
                    'on': false,
                },
                {
                    'header': 'pre_cdr3_match',
                    'name': 'Pre-CDR3 V Gene Match',
                    'desc': 'Total number of bases in the V-gene matching the germline, excluding gaps, before the CDR3.',
                    'on': false,
                },
                {
                    'header': 'pre_cdr3_length',
                    'name': 'Pre-CDR3 V Gene Length',
                    'desc': 'Total number of bases in the V-gene, excluding gaps, before the CDR3.',
                    'on': false,
                },
                {
                    'header': 'post_cdr3_match',
                    'name': 'Post-CDR3 J Gene Match',
                    'desc': 'Total number of bases in the J-gene matching the germline after the CDR3.',
                    'on': false,
                },
                {
                    'header': 'post_cdr3_length',
                    'name': 'Post-CDR3 J Gene Length',
                    'desc': 'Total number of bases in the J-gene after the CDR3.',
                    'on': false,
                },
                {
                    'header': 'sequence_filled',
                    'name': 'Full Sequence',
                    'desc': 'The full sequence with padding replaced with germline bases.',
                    'on': true,
                },
                {
                    'header': 'sequence',
                    'name': 'Full Sequence',
                    'desc': 'The full sequence including any padding from alignment.',
                    'on': false,
                },
                {
                    'header': 'germline',
                    'name': 'Sequence Germline',
                    'desc': 'The germline sequence with gaps inserted for the CDR3.',
                    'on': true,
                },
                {
                    'header': 'clone_id',
                    'name': 'Clone ID',
                    'desc': 'The unique clone identifier for this sequence, if any.',
                    'on': true,
                },
                {
                    'header': 'clone_group_id',
                    'name': 'Clone Group ID',
                    'desc': 'The unique clone group identifier for the associated clone for correlating across '
                        + 'database versions.',
                    'on': false,
                },
                {
                    'header': 'clone_cdr3_nt',
                    'name': 'Clone Consensus CDR3 Nucleotides',
                    'desc': 'The nucleotides comprising the associated clone\'s consensus CDR3.',
                    'on': true,
                },
                {
                    'header': 'clone_cdr3_aa',
                    'name': 'Clone Consensus CDR3 Amino Acids',
                    'desc': 'The amino acids comprising the associated clone\'s consensus CDR3.',
                    'on': true,
                },
                {
                    'header': 'clone_json_tree',
                    'name': 'Clone Tree',
                    'desc': 'The clone lineage tree represented in JSON.  Note that including this field can '
                        + 'drastically increase file size',
                    'on': false,
                },
            ];

            var init = function() {
                $scope.showLoader()
                $scope.$parent.page_title = 'Master Table Export';

                $scope.apiUrl = APIService.getUrl();
                $scope.type = $routeParams['type'].charAt(0).toUpperCase() +
                    $routeParams['type'].slice(1);
                $scope.id = $routeParams['id'];

                $scope.checked_fields = $scope.fields.filter(function(f) {
                    return f.on;
                }).map(function(f) {
                    return f.header
                });
                $scope.hideLoader()
            }

            init();
        }
    ]);
})();
