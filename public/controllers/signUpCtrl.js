'use strict';

angular.module('MovIn')
  .controller('SignUpCtrl', function($scope, $rootScope, $http, $location, UserService) {
    //This makes the map
    var placeSearch, autocomplete;
    $scope.formData = {};
    $scope.place = null;
    $scope.autocompleteOptions = {
        // componentRestrictions: { },
        types: ['geocode']
    };

    // $scope.dob = new Date();
    $scope.dateOptions = {
        formatYear: 'yy',
        startingDay: 1
    };

    $scope.register = function (formdata) {
        $scope.formData.username = $scope.formData.email.split('@')[0];
        $scope.formData.originalpassword = $scope.formData.password;
        $scope.formData.age = Math.abs(new Date(Date.now() - $scope.dob.getTime()).getUTCFullYear() - 1970);
		UserService.register(formdata).success(function(data, status) {
			// console.log("Received Data", data);
			$scope.user = data;
			$location.path("/profile");
		}).error(function(status, data) {
			console.log(status);
			console.log(data);
		});
        // console.log(formdata);
    };

    $scope.dobOpen = function($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.dobToggle = !$scope.dobToggle;
    };
  });