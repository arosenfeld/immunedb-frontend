'use strict';

(function() {
    angular.module('ImmunologyApp', [
        'ngAnimate',
        'ngCookies',
        'ngResource',
        'ngRoute',
        'ngSanitize',
        'highcharts-ng',
        'checklist-model',
        'ImmunologyFilters'
    ])
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
                .otherwise({
                    redirectTo: '/studies'
                });
        })
        .constant('apiUrl', 'http://129.25.28.237:5000/api/');
})();
