'use strict';

angular.module('RoommateFinder')
  .controller('LoginCtrl', function($scope, $rootScope, $http, $location, $window, UserService, $timeout) {
    // This object will be filled by the form

    $scope.login = function (email, password) {
      UserService.signIn(email, password).success(function(data) {
        // $scope.user = data;
        $location.path("/");
      }).error(function(status, data) {
        $scope.message = "Login Failed!";
        $timeout(function () {
          $scope.message = null;
        }, 3000);
        console.log(data);
      });
    };


    $scope.logout = function() {
      UserService.logOut().success(function(data) {
        $location.path("/");
      }).error(function(status, data) {
        console.log(status);
        console.log(data);
      });
    };
    
    
  });