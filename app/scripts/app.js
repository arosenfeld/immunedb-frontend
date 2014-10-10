(function() {
    'use strict';

    angular.module('ImmunologyApp', [ 'ngAnimate', 'ngCookies', 'ngResource',
            'ngRoute', 'ngSanitize', 'highcharts-ng', 'checklist-model',
            'ImmunologyFilters', 'ImmunologyDirectives' ])
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
                .when('/sequence/:seqId', {
                    templateUrl: 'views/sequence.html',
                    controller: 'SequenceCtrl'
                })
                .otherwise({
                    redirectTo: '/studies'
                });
        })
        .constant('apiUrl', 'http://129.25.28.237:2000/api/');
})();
