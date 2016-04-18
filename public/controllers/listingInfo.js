'use strict';

angular.module('MovIn')
  .controller('ListingInfo', function($scope, $rootScope, $http, $location, UserService, Upload, $timeout, $route) {
    
    var placeSearch, autocomplete;
    $scope.formData = {};
    $scope.listingData = {};
    $scope.place = null;
    $scope.myInterval = 5000;
    $scope.noWrapSlides = false;
    $scope.active = 0;
    $scope.error = false;
    $scope.success = false;
    $scope.showModal = false;
    $scope.autocompleteOptions = {
        // componentRestrictions: { },
        types: ['geocode']
    };

    $scope.init = function(){
        $http.get('/user/loggedin').then(function(data){
        // console.log("received Data",loggedin);
            if(data.data){ 
                $scope.user = data.data;
                $scope.loc_id = $location.path().split('/')[2];
                $http.get('/listing/'+$scope.loc_id).then(function(data){
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
                    $scope.listingData.girls_only =  data.data.girls_only;
                    $scope.listingData.img_url =  data.data.img_url;
                    $scope.listingData.utilities_included = data.data.utilities_included;
                });
            }else{
            $rootScope.nextPath = $location.path();
            $location.path('login');
        }
        });
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

    $scope.init();
  });