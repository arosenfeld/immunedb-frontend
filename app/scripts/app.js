(function() {
    'use strict';

    angular.module('ImmunologyApp', [ 'ngAnimate', 'ngCookies', 'ngResource',
    'ngCookies', 'ngRoute', 'ngSanitize', 'highcharts-ng', 'checklist-model',
    'ui.bootstrap', 'ImmunologyFilters', 'ImmunologyDirectives' ])
        .config(function($routeProvider) {
            $routeProvider
                .when('/:apiPath/studies', {
                    templateUrl: 'views/studies.html',
                    controller: 'StudiesCtrl',
                })
                .when('/:apiPath/samples/:sampleIds', {
                    templateUrl: 'views/samples.html',
                    controller: 'SampleCtrl'
                })
                .when('/:apiPath/clones', {
                    templateUrl: 'views/clones.html',
                    controller: 'ClonesCtrl',
                })
                .when('/:apiPath/clone/:cloneId/:sampleIds?', {
                    templateUrl: 'views/clone.html',
                    controller: 'CloneCtrl',
                })
                .when('/:apiPath/sequence/:sampleId/:seqId', {
                    templateUrl: 'views/sequence.html',
                    controller: 'SequenceCtrl'
                })
                .when('/:apiPath/subjects', {
                    templateUrl: 'views/subjects.html',
                    controller: 'SubjectsCtrl',
                })
                .when('/:apiPath/subject/:subjectId', {
                    templateUrl: 'views/subject.html',
                    controller: 'SubjectCtrl',
                })
                .when('/:apiPath/pins', {
                    templateUrl: 'views/pins.html',
                    controller: 'PinsCtrl',
                })
                .when('/:apiPath/sequences', {
                    templateUrl: 'views/sequences.html',
                    controller: 'SequencesCtrl',
                })
                .when('/:apiPath/export_clones/:type/:id', {
                    templateUrl: 'views/export_clones.html',
                    controller: 'ExportClonesCtrl',
                })
                .when('/:apiPath/export_sequences/:type/:id', {
                    templateUrl: 'views/export_sequences.html',
                    controller: 'ExportSequencesCtrl',
                })
                .when('/:apiPath/export_mutations/:type/:id', {
                    templateUrl: 'views/export_mutations.html',
                    controller: 'ExportMutationsCtrl',
                })
                .when('/:apiPath/modification_log', {
                    templateUrl: 'views/modification_log.html',
                    controller: 'ModificationLogCtrl',
                })
                .when('/:apiPath', {
                   redirectTo: function(routeParams, path, search) {
                       return routeParams.apiPath + '/studies';
                   }
                })
                .otherwise({
                    redirectTo: '/primary'
                });
        })
        .constant('apis', {
            'primary': {
                'name': 'YOUR DB NAME',
                'url': 'http://your/db/api'
            },
        });
})();
