'use strict';

angular.module('MovIn')
    .controller('queryCtrl', function($scope, $log, $http, $rootScope, $location, gservice, UserService, geolocation, $routeParams, $route){

        $scope.formData = {};
        $scope.formData.location = [];
        $scope.queryBody = {
            longitude: undefined,
            latitude: undefined,
            distance: 1,
            male: $scope.formData.male,
            female: $scope.formData.female
            // minAge: $scope.formData.minage,
            // maxAge: $scope.formData.maxage
        };

        $http.get('/user/loggedin').then(function(data){
            if(data.data){
                $scope.user=data.data;
            }
        });
        $scope.mainPgSrch = $location.search();

        $scope.init = function(){
            // console.log($scope.mainPgSrch);
            if($scope.mainPgSrch.location){
                gservice.refresh(parseFloat($scope.mainPgSrch.location.coordinates[1]), parseFloat($scope.mainPgSrch.location.coordinates[0]), false, $scope.formData.distance);
                $scope.formData.location = {type: 'Point', coordinates:[parseFloat($scope.mainPgSrch.location.coordinates[0]), parseFloat($scope.mainPgSrch.location.coordinates[1])]};
                $scope.queryUsers();
            }else{
                geolocation.getLocation().then(function(data){
                    gservice.refresh(parseFloat(data.coords.latitude), parseFloat(data.coords.longitude), false, $scope.formData.distance);
                    $scope.formData.location = {type: 'Point', coordinates:[parseFloat(data.coords.longitude), parseFloat(data.coords.latitude)]};
                    $scope.queryUsers();
                });
            }
        };

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

        // Get coordinates based on mouse click. When a click event is detected....
        // $rootScope.$on("clicked", function(){

        //     // Run the gservice functions associated with identifying coordinates
        //     $scope.$apply(function(){
        //         $scope.formData.location = [parseFloat(gservice.clickLong).toFixed(3), parseFloat(gservice.clickLat).toFixed(3)];
        //     });
        //     $scope.queryUsers();
        // });

        $scope.queryUsers = function(){
            if($scope.formData.location.coordinates.length > 0){
                // console.log($scope.formData.location);  
                $scope.queryBody.longitude = parseFloat($scope.formData.location.coordinates[0]);
                $scope.queryBody.latitude = parseFloat($scope.formData.location.coordinates[1]);
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

            // console.log("query",$scope.queryBody);
            // Post the queryBody to the /query POST route to retrieve the filtered results
            $http.post('/query', $scope.queryBody)
                // Store the filtered results in queryResults
                .success(function(queryResults){

                    // Pass the filtered results to the Google Map Service and refresh the map
                    gservice.refresh($scope.queryBody.latitude, $scope.queryBody.longitude, queryResults, $scope.queryBody.distance);
                    // Count the number of records retrieved for the panel-footer
                    $scope.queryCount = queryResults.length;
                })
                .error(function(queryResults){
                    console.log('Error ' + queryResults);
                });
        };

        $scope.showPopover = function() {
            $scope.popoverIsVisible = true;
        };

        $scope.hidePopover = function () {
            $scope.popoverIsVisible = false;
        };

        $scope.init();
});