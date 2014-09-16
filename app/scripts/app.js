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
      .when('/', {
        templateUrl: 'views/studies.html',
        controller: 'StudiesCtrl',
      })
      .otherwise({
        redirectTo: '/'
      });
  })
  .constant('apiUrl', 'http://localhost:5000/api/');
