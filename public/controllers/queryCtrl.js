'use strict';

angular.module('RoommateFinder')
    .controller('queryCtrl', function($scope, $log, $http, $rootScope, $location, gservice, UserService, geolocation){

        $scope.formData = {};
        $scope.formData.location = []
        var queryBody = {};

        $http.get('/user/loggedin').then(function(data){
            if(data.data){ 
                $scope.user=data.data;
            }
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

        geolocation.getLocation().then(function(data){
            // console.log(data.coords);
            gservice.refresh(parseFloat(data.coords.latitude), parseFloat(data.coords.longitude), false);
            $scope.formData.location = [parseFloat(data.coords.longitude), parseFloat(data.coords.latitude)]
        });

        $scope.queryBody = {
            longitude: undefined,
            latitude: undefined,
            distance: 5,
            male: $scope.formData.male,
            female: $scope.formData.female
            // minAge: $scope.formData.minage,
            // maxAge: $scope.formData.maxage
        };

        // Get coordinates based on mouse click. When a click event is detected....
        // $rootScope.$on("clicked", function(){

        //     // Run the gservice functions associated with identifying coordinates
        //     $scope.$apply(function(){
        //         $scope.formData.location = [parseFloat(gservice.clickLong).toFixed(3), parseFloat(gservice.clickLat).toFixed(3)];
        //     });
        //     $scope.queryUsers();
        // });

        $scope.queryUsers = function(){
            if($scope.formData.location){
                $scope.queryBody.longitude = parseFloat($scope.formData.location[0]);
                $scope.queryBody.latitude = parseFloat($scope.formData.location[1]);
            }

            if($scope.formData.distance){
                $scope.queryBody.distance = parseFloat($scope.formData.distance);
            }

            if($scope.formData.male){
                $scope.queryBody.male = $scope.formData.male;
            }
            
            if($scope.formData.female){
                $scope.queryBody.female = $scope.formData.female;
            }
            
            if($scope.formData.minage){
                $scope.queryBody.minAge = $scope.formData.minage;
            }

            if($scope.formData.maxage){
                $scope.queryBody.maxAge = $scope.formData.maxage;
            }

            console.log("query",$scope.queryBody);
            // Post the queryBody to the /query POST route to retrieve the filtered results
            $http.post('/query', $scope.queryBody)

                // Store the filtered results in queryResults
                .success(function(queryResults){

                    // Pass the filtered results to the Google Map Service and refresh the map
                    gservice.refresh($scope.queryBody.latitude, $scope.queryBody.longitude, queryResults);
                    console.log(queryResults);
                    // Count the number of records retrieved for the panel-footer
                    $scope.queryCount = queryResults.length;
                })
                .error(function(queryResults){
                    console.log('Error ' + queryResults);
                });
        };
});