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
                    'desc': 'The alignment method used for the sequence (R1, R2, pRESTO)',
                    'on': true,
                },
                {
                    'header': 'in_frame',
                    'name': 'In Frame',
                    'desc': 'If the sequence\'s length is a multiple of three.',
                    'on': true,
                },
                {
                    'header': 'levenshtein_dist',
                    'name': 'Levenshtein Distance',
                    'desc': 'For misaligned or indel probable sequences, The Levenshtein distance of the sequence to the germline.',
                    'on': false,
                },
                {
                    'header': 'num_gaps',
                    'name': 'Number of Gaps',
                    'desc': 'Number of V-gene gaps inserted based on IMGT numbering.',
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
            ];

            var init = function() {
                $scope.showLoader()
                $scope.$parent.page_title = 'Master Table Export';
                $scope.type = $routeParams['type'].charAt(0).toUpperCase() +
                    $routeParams['type'].slice(1);
                $scope.id = $routeParams['id'];
                $scope.hideLoader()
            }

            init();
        }
    ]);
})();
