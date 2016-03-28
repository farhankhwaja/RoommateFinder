'use strict';

angular.module('MovIn')
  .controller('LoginCtrl', function($scope, $rootScope, $http, $location, $window, UserService, $timeout) {
    // This object will be filled by the form

    $scope.login = function (email, password) {
      UserService.signIn(email, password).success(function(data) {
        // $scope.user = data;
        if(data.success){
          $location.path("/");
        }else{
          $scope.message = data.message;
          $timeout(function () {
            $scope.message = null;
          }, 3000);
        }
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