'use strict';

angular.module('MovIn', [
    'ngRoute',
    'ngResource',
    'ngAnimate',
    'ngCookies',
    'ngSanitize',
    'ngTouch',
    'ui.bootstrap.tabs',
    'ui.router',
    'ui.bootstrap.tpls',
    'ui.bootstrap',
    'ui.bootstrap.datepicker',
    'google.places',
    'geolocation',
    'ngFileUpload']);

angular.module('MovIn')
  .config(function ($routeProvider, $locationProvider, $httpProvider) {

    $routeProvider
      .when('/', {
        templateUrl: '/views/main.html',
        controller: 'MainCtrl',
      })
      .when('/signup', {
        templateUrl: '/views/signup.html',
        controller: 'SignUpCtrl'
     })
      .when('/login', {
        templateUrl: '/views/login.html',
        controller: 'LoginCtrl'
     })
      .when('/profile', {
        templateUrl: '/views/profile.html',
        controller: 'ProfileCtrl'
     })
      .when('/search', {
        templateUrl: '/views/search.html',
        controller: 'queryCtrl'
     });
      // .otherwise({
      //   redirectTo: '/'
       // });
  });