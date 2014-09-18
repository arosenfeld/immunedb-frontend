'use strict';

angular.module('ImmunologyApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/studies', {
        templateUrl: 'views/studies.html',
        controller: 'StudiesCtrl',
      })
      .when('/samples/:sampleId', {
        templateUrl: 'views/sample.html',
        controller: 'SampleCtrl'
      })
      .otherwise({
        redirectTo: '/studies'
      });
  })
  .constant('apiUrl', 'http://localhost:5000/api/');
