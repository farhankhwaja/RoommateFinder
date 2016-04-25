'use strict';

angular.module('MovIn')
    .controller('queryCtrl', function($scope, $log, $http, $rootScope, $location, UserService, geolocation, $routeParams, $route){

        $scope.formData = {};
        $scope.formData.location = [];
        $scope.showModal = false;
        $scope.loginShowModal = false;
        $scope.smartSearch = {};
        $scope.queryBody = {};
        $scope.initBody = {};
        $scope.listingData = {};

        $scope.mainPgSrch = $location.search();

        $scope.init = function(){
            $http.get('/user/loggedin').then(function(data){
                if(data.data){
                    $scope.user = data.data;
                }
            });
            // console.log($scope.mainPgSrch);
            if($scope.mainPgSrch.location){
                // console.log($scope.mainPgSrch.location);
                // gservice.refresh(parseFloat($scope.mainPgSrch.location.coordinates[1]), parseFloat($scope.mainPgSrch.location.coordinates[0]), false, $scope.formData.distance);
                $scope.formData.location = {type: 'Point', coordinates:[parseFloat($scope.mainPgSrch.location.coordinates[0]), parseFloat($scope.mainPgSrch.location.coordinates[1])]};
                $scope.formData.female = true;
                $scope.formData.male = true;
                $scope.initUsers();
            }else{
                geolocation.getLocation().then(function(data){
                    // gservice.refresh(parseFloat(data.coords.latitude), parseFloat(data.coords.longitude), false, $scope.formData.distance);
                    $scope.formData.location = {type: 'Point', coordinates:[parseFloat(data.coords.longitude), parseFloat(data.coords.latitude)]};
                    // $scope.formData.female = true;
                    // $scope.formData.male = true;
                    $scope.initUsers();
                    // $scope.formData = {}
                });
            }
        };

        $scope.logOut = function() {
            UserService.logOut().success(function(data) {
                    $location.path("search");
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

        $scope.initUsers = function(){
            if($scope.formData.location.coordinates.length > 0){
                $scope.initBody.longitude = parseFloat($scope.formData.location.coordinates[0]);
                $scope.initBody.latitude = parseFloat($scope.formData.location.coordinates[1]);
                $scope.latitude = $scope.initBody.latitude;
                $scope.longitude = $scope.initBody.longitude;
            }

            $scope.initBody.distance = parseFloat(1.0);
            $scope.distance = $scope.initBody.distance;
            $scope.initBody.male = 'Male';
            $scope.initBody.female = 'Female';
            
            if($scope.formData.minage){
                $scope.initBody.minAge = $scope.formData.minage;
            }

            if($scope.formData.maxage){
                $scope.initBody.maxAge = $scope.formData.maxage;
            }

            // Post the initBody to the /query POST route to retrieve the filtered results
            $http.post('/query', $scope.initBody)
                // Store the filtered results in queryResults
                .success(function(queryResults){
                    $scope.marks = queryResults;
                })
                .error(function(queryResults){
                    console.log('Error ' + queryResults);
                });
        };

        $scope.queryUsers = function(){
            if($scope.user){
                $scope.queryBody.user_id = $scope.user._id;
            }
            if($scope.formData.location.coordinates.length > 0){
                $scope.queryBody.longitude = parseFloat($scope.formData.location.coordinates[0]);
                $scope.queryBody.latitude = parseFloat($scope.formData.location.coordinates[1]);
                $scope.latitude = $scope.queryBody.latitude;
                $scope.longitude = $scope.queryBody.longitude;
            }

            
            $scope.queryBody.distance = $scope.formData.distance ? parseFloat($scope.formData.distance) : 1.0;
            $scope.distance = $scope.queryBody.distance;
            
            if($scope.formData.male){
                $scope.queryBody.male = 'Male';
            }else{
                $scope.queryBody.male = '';
            }
            
            if($scope.formData.female){
                $scope.queryBody.female = 'Female';
            }else{
                $scope.queryBody.female = '';
            }
            
            if($scope.formData.pool){
                $scope.queryBody.pool = $scope.formData.pool;
            }

            if($scope.formData.rooftop){
                $scope.queryBody.rooftop = $scope.formData.rooftop;
            }

            if($scope.formData.subLease){
                $scope.queryBody.subLease = 'subLease';
            }

            if($scope.formData.lease){
                $scope.queryBody.lease = 'lease';
            }

            // Post the queryBody to the /query POST route to retrieve the filtered results
            $http.post('/query', $scope.queryBody)
                // Store the filtered results in queryResults
                .success(function(queryResults){
                    $scope.marks = queryResults;
                    $scope.queryBody = {};
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

        $scope.checkValue = function(value){
            if($scope.formData.location.coordinates.length > 0){
                $scope.queryBody.longitude = parseFloat($scope.formData.location.coordinates[0]);
                $scope.queryBody.latitude = parseFloat($scope.formData.location.coordinates[1]);
            }

            
            $scope.queryBody.distance = $scope.formData.distance ? parseFloat($scope.formData.distance) : 1.0;

            if($scope.formData.male){
                $scope.queryBody.male = 'Male';
            }
            
            if($scope.formData.female){
                $scope.queryBody.female = 'Female';
            }
            
            if($scope.formData.minage){
                $scope.queryBody.minAge = $scope.formData.minage;
            }

            if($scope.formData.maxage){
                $scope.queryBody.maxAge = $scope.formData.maxage;
            }

            if($scope.formData.pool){
                $scope.queryBody.pool = $scope.formData.pool;
            }

            if($scope.formData.rooftop){
                $scope.queryBody.rooftop = $scope.formData.rooftop;
            }

            $scope.queryBody.geek = $scope.user.geek;
            $scope.queryBody.gamer = $scope.user.gamer;
            $scope.queryBody.party = $scope.user.party;
            $scope.queryBody.musician = $scope.user.musician;
            $scope.queryBody.artist = $scope.user.artist;
            $scope.queryBody.vegan = $scope.user.vegan;
            $scope.queryBody.bookworm = $scope.user.bookworm;
            $scope.queryBody.athlete = $scope.user.athlete;
            $scope.queryBody.fitness = $scope.user.fitness;
            $scope.queryBody.redditor = $scope.user.redditor;
            $scope.queryBody.live_sports = $scope.user.live_sports;
            $scope.queryBody.early_riser = $scope.user.early_riser;
            $scope.queryBody.night_owl = $scope.user.night_owl;
            $scope.queryBody.shopaholic = $scope.user.shopaholic;
            $scope.queryBody.foodie = $scope.user.foodie;

            // Post the queryBody to the /query POST route to retrieve the filtered results
            $http.post('/smartSearch', $scope.queryBody)
                // Store the filtered results in queryResults
                .success(function(queryResults){
                    // Pass the filtered results to the Google Map Service and refresh the map
                    gservice.refresh($scope.queryBody.latitude, $scope.queryBody.longitude, queryResults, $scope.queryBody.distance);
                    // Count the number of records retrieved for the panel-footer
                    $scope.queryCount = queryResults.length;
                    $scope.queryBody = {};
                })
                .error(function(queryResults){
                    console.log('Error ' + queryResults);
                });

        };

        $scope.toggleModal = function(aptId){
            $http.get('/listing/'+aptId).then(function(data){
                console.log(data.data);
                $scope.listingData.address = data.data.address;
                $scope.listingData.description = data.data.description;
                $scope.listingData.location = data.data.location;
                $scope.listingData.aptNo = data.data.aptNo ? data.data.aptNo : 'N/A';
                // $scope.listingData.type = data.data.type;
                $scope.listingData.isFor = data.data.isFor;
                $scope.listingData.rent = data.data.rent;
                $scope.listingData.pool = data.data.pool;
                $scope.listingData.rooftop = data.data.rooftop;
                $scope.listingData.laundry = data.data.laundry;
                $scope.listingData.ac_heater = data.data.ac_heater;
                $scope.listingData.no_rooms = data.data.no_rooms;
                $scope.listingData.sq_ft = data.data.sq_ft;
                $scope.listingData.baths = data.data.baths;
                $scope.listingData.fridge = data.data.fridge;
                $scope.listingData.microwave = data.data.microwave;
                $scope.listingData.floor = data.data.floor;
                $scope.listingData.beds = data.data.beds;
                $scope.listingData.parking_area = data.data.parking_area;
                $scope.listingData.pet_friendly = data.data.pet_friendly;
                $scope.listingData.smoking = data.data.smoking;
                $scope.listingData.guys_only = data.data.guys_only;
                $scope.listingData.girls_only =  data.data.girls_only;
                $scope.listingData.img_url =  data.data.img_url;
                $scope.listingData.utilities_included = data.data.utilities_included;
                $scope.markerData = [{
                    color: 'red',
                    label: 'X',
                    coords: [$scope.listingData.location.coordinates[1], $scope.listingData.location.coordinates[0]]
                }];
            });
            $scope.showModal = !$scope.showModal;
        };

        $scope.gotoLogin = function(){
            $scope.showModal = !$scope.showModal;
            $scope.loginShowModal = !$scope.loginShowModal;
        };

        $scope.login = function (email, password) {
            UserService.signIn(email, password).success(function(data) {
                if(data.success){
                    $http.get('/user/loggedin').then(function(data){
                        if(data.data){
                            $scope.user = data.data;
                            $scope.hitMe = data.data._id;
                            // console.log($scope.hitMe);
                        }
                    });
                    $scope.loginShowModal = !$scope.loginShowModal;
                }else{
                    $scope.message = data.message;
                    $timeout(function () {
                        $scope.message = null;
                    }, 3000);
                }
            });
        };
        $scope.init();
});