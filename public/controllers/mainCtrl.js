'use strict';

angular.module('MovIn')
  .controller('MainCtrl', function($scope, $rootScope, $http, $location, UserService, $timeout, $route) {
    // This object will be filled by the form
    $scope.formData = {};
    $scope.queryBody = {
            longitude: undefined,
            latitude: undefined,
            distance: 2,
            male: $scope.formData.male,
            female: $scope.formData.female
            // minAge: $scope.formData.minage,
            // maxAge: $scope.formData.maxage
        };

    $http.get('/user/loggedin').then(function(data){
		// console.log("received Data",data);
		if(data.data){ $scope.user = data.data;}
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

	$scope.queryUsers = function(){

            if($scope.formData.location.coordinates.length > 0){
                // console.log($scope.formData.location);  
                $scope.queryBody.longitude = parseFloat($scope.formData.location.coordinates[0]);
                $scope.queryBody.latitude = parseFloat($scope.formData.location.coordinates[1]);
            }

            $location.search({location:$scope.formData.location});
            $location.path('/search');
        //     // console.log("query",$scope.queryBody);
        //     // Post the queryBody to the /query POST route to retrieve the filtered results
        //     $http.post('/query', $scope.queryBody)

        //         // Store the filtered results in queryResults
        //         .success(function(queryResults){

        //             // Pass the filtered results to the Google Map Service and refresh the map
        //             // gservice.refresh($scope.queryBody.latitude, $scope.queryBody.longitude, queryResults);
        //             // // Count the number of records retrieved for the panel-footer
        //             // $scope.queryCount = queryResults.length;
        //             $location.path('/search');
        //         })
        //         .error(function(queryResults){
        //             console.log('Error ' + queryResults);
        //         });
        };
  });