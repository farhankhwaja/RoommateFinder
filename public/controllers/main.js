'use strict';

angular.module('RoommateFinder', [
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
    'uiGmapgoogle-maps',
    'google.places',
    'geolocation']);

angular.module('RoommateFinder')
  .config(function ($routeProvider, $locationProvider, $httpProvider) {

    //================================================
    // Check if the user is connected
    //================================================
    var checkLoggedin = function($q, $timeout, $http, $location, $rootScope){
      // Initialize a new promise
      var deferred = $q.defer();

      // Make an AJAX call to check if the user is logged in
      $http.get('/user/loggedin').success(function(user){
        // Authenticated
        if (user !== '0'){
          /*$timeout(deferred.resolve, 0);*/
          deferred.resolve();

        // Not Authenticated
        }else {
          $rootScope.message = 'You need to log in.';
          //$timeout(function(){deferred.reject();}, 0);
          deferred.reject();
        }
      });

      return deferred.promise;
    };
    //================================================
    
    //================================================
    // Add an interceptor for AJAX errors
    //================================================
    $httpProvider.interceptors.push(function($q, $location) {
      return {
        response: function(response) {
          // do something on success
          return response;
        },
        responseError: function(response) {
          if (response.status === 401)
            $location.url('/login');
          return $q.reject(response);
        }
      };
    });

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