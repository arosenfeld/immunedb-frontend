(function() {
    'use strict';

    angular.module('ImmunologyApp', [ 'ngAnimate', 'ngCookies', 'ngResource',
    'ngRoute', 'ngSanitize', 'highcharts-ng', 'checklist-model',
    'ui.bootstrap', 'ImmunologyFilters', 'ImmunologyDirectives' ])
        .config(function($routeProvider) {
            $routeProvider
                .when('/studies', {
                    templateUrl: 'views/studies.html',
                    controller: 'StudiesCtrl',
                })
                .when('/samples/:sampleIds', {
                    templateUrl: 'views/samples.html',
                    controller: 'SampleCtrl'
                })
                .when('/clones', {
                    templateUrl: 'views/clones.html',
                    controller: 'ClonesCtrl',
                })
                .when('/clone_compare/:uids', {
                    templateUrl: 'views/clone_compare.html',
                    controller: 'ClonesCompareCtrl',
                })
                .when('/sequence/:sampleId/:seqId', {
                    templateUrl: 'views/sequence.html',
                    controller: 'SequenceCtrl'
                })
                .when('/subjects/', {
                    templateUrl: 'views/subjects.html',
                    controller: 'SubjectsCtrl',
                })
                .otherwise({
                    redirectTo: '/studies'
                });
        })
        .constant('apiUrl', 'http://129.25.28.237:5000/api/');
})();
