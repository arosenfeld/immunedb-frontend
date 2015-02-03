(function() {
    'use strict';
    angular.module('ImmunologyApp').controller('ExportClonesCtrl', ['$scope',
            '$http', '$routeParams', '$log', 'APIService',
        function($scope, $http, $routeParams, $log, APIService) {
            $scope.force = [
                'clone_id', 'sample_id', 'unique_sequences', 'total_sequences'
            ];

            $scope.fields = [
                {
                    'header': 'clone_id',
                    'name': 'Clone ID',
                    'desc': 'The unique clone identifier.',
                },
                {
                    'header': 'sample_id',
                    'name': 'Sample ID',
                    'desc': 'The ID of the sample as it appears in the database.',
                },
                {
                    'header': 'unique_sequences',
                    'name': 'Unique Sequence Count',
                    'desc': 'The number of unique sequences in the sample for ' +
                        ' the given clone',
                },
                {
                    'header': 'total_sequences',
                    'name': 'Total Sequence Count',
                    'desc': 'The number of total sequences in the sample for ' +
                        ' the given clone',
                },
                {
                    'header': 'group_id',
                    'name': 'Clone Group ID',
                    'desc': 'The unique clone group identifier for the clone'
                },
                {
                    'header': 'v_gene',
                    'name': 'V Gene',
                    'desc': 'The V gene assigned to the clone.',
                },
                {
                    'header': 'j_gene',
                    'name': 'J Gene',
                    'desc': 'The J gene assigned to the clone.',
                },
                {
                    'header': 'cdr3_nt',
                    'name': 'CDR3 Nucleotides',
                    'desc': 'The bases comprising the consensus CDR3.',
                },
                {
                    'header': 'cdr3_aa',
                    'name': 'CDR3 Amino Acids',
                    'desc': 'The amino acids comprising the consensus CDR3.  Out of frame bases are ignored.',
                },
                {
                    'header': 'cdr3_num_nts',
                    'name': 'CDR3 Length (in NTs)',
                    'desc': 'Number of bases in the CDR3',
                },
                {
                    'header': 'functional',
                    'name': 'Functional',
                    'desc': 'If the clone\'s CDR3 length is a multiple of three and contains no stop codons.',
                },
                {
                    'header': 'sample_name',
                    'name': 'Sample Name',
                    'desc': 'The name of the sample.',
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
                    'header': 'tissue',
                    'name': 'Tissue',
                    'desc': 'The tissue from which the sample was taken.',
                },
                {
                    'header': 'subset',
                    'name': 'Subset',
                    'desc': 'The cell subset of the sample.',
                },
                {
                    'header': 'disease',
                    'name': 'Disease',
                    'desc': 'The disease(s), if any, in the subject from which the sample originates.',
                },
                {
                    'header': 'lab',
                    'name': 'Lab',
                    'desc': 'The lab which acquired the sample.',
                },
                {
                    'header': 'experimenter',
                    'name': 'Experimenter',
                    'desc': 'The individual who acquired the sample.',
                },
                {
                    'header': 'date',
                    'name': 'Date',
                    'desc': 'The date the sample was acquired (YYYY-MM-DD).',
                },
            ];

            $scope.clearFields = function() {
                $log.debug('clear');
                $scope.checked_fields = [];
            }

            $scope.changeType = function(format) {
                // Bug with checkbox plugin
                $scope.format = format.type;
                $scope.formatText = format.text;
            }

            var init = function() {
                $scope.showLoader();
                $scope.checked_fields = angular.copy($scope.force);
                $scope.format = null;
                $scope.$parent.page_title = 'Clone Export';
                $scope.apiUrl = APIService.getUrl();

                $scope.type = $routeParams['type'].charAt(0).toUpperCase() +
                    $routeParams['type'].slice(1);
                $scope.id = $routeParams['id'];

                $scope.hideLoader()
            }

            init();
        }
    ]);
})();
