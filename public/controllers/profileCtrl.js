'use strict';

angular.module('RoommateFinder')
  .controller('ProfileCtrl', function($scope, $rootScope, $http, $location, UserService) {
    
    $http.get('/user/loggedin').then(function(data){
        console.log("received Data",data);
        if(data.data){ $scope.user=data.data;}
    });
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