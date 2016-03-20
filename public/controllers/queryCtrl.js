'use strict';

angular.module('RoommateFinder')
    .controller('queryCtrl', function($scope, $log, $http, $rootScope, gservice, UserService ){

        $scope.formData = {};
        $scope.map = { center: { latitude: 45, longitude: -73 }, zoom: 8 };
        var queryBody = {};

        $http.get('/user/loggedin').then(function(data){
            if(data.data){ 
                $scope.user=data.data;
                    queryBody = {
                    longitude: parseFloat($scope.user.location[0]),
                    latitude: parseFloat($scope.user.location[1]),
                    distance: parseFloat($scope.formData.distance),
                    male: $scope.formData.male,
                    female: $scope.formData.female,
                    other: $scope.formData.other,
                    minAge: $scope.formData.minage,
                    maxAge: $scope.formData.maxage,
                    favlang: $scope.formData.favlang,
                    reqVerified: $scope.formData.verified
                };
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
    // Take query parameters and incorporate into a JSON queryBody
        $scope.queryUsers = function(){

            // Post the queryBody to the /query POST route to retrieve the filtered results
            $http.post('/query', queryBody)

                // Store the filtered results in queryResults
                .success(function(queryResults){

                    // Pass the filtered results to the Google Map Service and refresh the map
                    gservice.refresh(queryBody.latitude, queryBody.longitude, queryResults);

                    // Count the number of records retrieved for the panel-footer
                    $scope.queryCount = queryResults.length;
                })
                .error(function(queryResults){
                    console.log('Error ' + queryResults);
                })
        };
});