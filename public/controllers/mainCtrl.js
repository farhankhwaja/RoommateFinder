'use strict';

angular.module('RoommateFinder')
  .controller('MainCtrl', function($scope, $rootScope, $http, $location, UserService, $timeout, $route) {
    // This object will be filled by the form
    $http.get('/user/loggedin').then(function(data){
		// console.log("received Data",data);
		if(data.data){ $scope.user=data.data;}
    });

    $scope.logOut = function() {
		UserService.logOut().success(function(data) {
				$location.path("/");
				$route.reload();
		}).error(function(status, data) {
			console.log("Error");
			console.log(status);
			console.log(data);
		});
	};
  });