'use strict';

angular.module('RoommateFinder')
  .controller('SignUpCtrl', function($scope, $rootScope, $http, $location, UserService) {
    //This makes the map
    var placeSearch, autocomplete;
    $scope.formData = {};
    $scope.place = null;
    $scope.map = { center: { latitude: 45, longitude: -73 }, zoom: 8 };
    $scope.autocompleteOptions = {
        // componentRestrictions: { },
        types: ['geocode']
    };

    // $scope.$watch('geometry', function(newVal){
    // 	if(newVal){
    // 		console.log($scope.geometry.lat());
    // 	}
    // });

    $scope.register = function (formdata) {
    	$scope.formData.username = $scope.formData.email.split('@')[0];
    	$scope.formData.originalpassword = $scope.formData.password;
		UserService.register(formdata).success(function(status, data) {
			console.log("Received Data", data);
			$scope.user = data;
			$location.path("/");
		}).error(function(status, data) {
			console.log(status);
			console.log(data);
		});
  		// console.log(formdata);
    };
  });