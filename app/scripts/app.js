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
                .when('/:apiPath/clone_compare/:uids', {
                    templateUrl: 'views/clone_compare.html',
                    controller: 'ClonesCompareCtrl',
                })
                .when('/:apiPath/sequence/:sampleId/:seqId', {
                    templateUrl: 'views/sequence.html',
                    controller: 'SequenceCtrl'
                })
                .when('/:apiPath/subjects/', {
                    templateUrl: 'views/subjects.html',
                    controller: 'SubjectsCtrl',
                })
                .when('/:apiPath/subject/:subjectId', {
                    templateUrl: 'views/subject.html',
                    controller: 'SubjectCtrl',
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
                'name': 'Similarity 85%',
                'url': 'http://129.25.28.237:2000/api/'
            },
            'similarity-65': {
                'name': 'Similarity 65%',
                'url': 'http://129.25.28.237:2001/api/'
            }
        });
})();
