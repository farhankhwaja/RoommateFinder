'use strict';

angular.module('MovIn')
  .controller('ProfileCtrl', function($scope, $rootScope, $http, $location, UserService, Upload, $timeout, $route) {
    
    var placeSearch, autocomplete;
    $scope.formData = {};
    $scope.listingData = {};
    $scope.place = null;
    $scope.error = false;
    $scope.success = false;
    $scope.autocompleteOptions = {
        // componentRestrictions: { },
        types: ['geocode']
    };

    $scope.init = function(){
        $http.get('/user/loggedin').then(function(data){
        // console.log("received Data",loggedin);
            if(data.data){ 
                $scope.user = data.data;
                $scope.formData._id = $scope.user._id;
                $scope.formData.geek = $scope.user.geek;
                $scope.formData.gamer = $scope.user.gamer;
                $scope.formData.party = $scope.user.party;
                $scope.formData.musician = $scope.user.musician;
                $scope.formData.artist = $scope.user.artist;
                $scope.formData.vegan = $scope.user.vegan;
                $scope.formData.bookworm = $scope.user.bookworm;
                $scope.formData.athlete = $scope.user.athlete;
                $scope.formData.gay = $scope.user.gay;
                $scope.formData.redditor = $scope.user.redditor;
                $scope.formData.live_sports = $scope.user.live_sports;
                $scope.formData.early_riser = $scope.user.early_riser;
                $scope.formData.night_owl = $scope.user.night_owl;
                $scope.formData.shopaholic = $scope.user.shopaholic;
                
                $scope.listingData.user_id = $scope.user._id;
                $http.get('/listing').then(function(data){
                    console.log(data);
                    $scope.place = data.data.address;

                    $scope.listingData.type = data.data.type;
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
                    $scope.listingData.girls_only =  data.girls_only;
                    $scope.listingData.utilities_included = data.data.utilities_included;
                })
            }else{
            $location.path('login');
        }
        });
    };

    $scope.saveProfile = function (formdata) {
		UserService.update(formdata).success(function(data) {
			console.log("Received Data", data);
			$scope.user = data;
            $scope.message = "Profile Information Updated";
            $scope.success = true;
            $timeout(function () {
            $scope.success = false;
          }, 3000);
		}).error(function(status, data) {
			console.log(status);
			console.log(data);
            $scope.error = true;
            $scope.message = "Profile Information Failed. Please try again.";
            $timeout(function () {
            $scope.error = false;
          }, 3000);
		});
        $scope.personal = !$scope.personal; 
    };

    $scope.uploadFiles = function (files) {
        $scope.files = files;
        if (files && files.length) {
            Upload.upload({
                url: '/listing/uploads',
                arrayKey: '',
                data: {
                    "files": files,
                    "user": "Farhan Khwaja"
                },
                method: 'POST'
            }).then(function (response) {
                $scope.message = response.data;
                $timeout(function () {
                    $scope.message = null;
                }, 3000);
            }, function (response) {
                if (response.status > 0) {
                    $scope.errorMsg = response.status + ': ' + response.data;
                }
            }, function (evt) {
                $scope.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total, 10));
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

    $scope.saveListing = function (formdata) {
        UserService.addPlace(formdata).success(function(data) {
            // console.log("Received Data", data);
            $scope.listingData = data;
            $scope.message = "Property Information Added";
            $scope.success = true;
            $timeout(function () {
            $scope.success = false;
          }, 3000);
        }).error(function(status, data) {
            console.log(status);
            console.log(data);
            $scope.error = true;
            $scope.message = "Property Information Failed. Please try again.";
            $timeout(function () {
            $scope.error = false;
          }, 3000);
        });
        console.log(formdata);
        $scope.aptInfo = !$scope.aptInfo; 
    };
    $scope.init();
  });