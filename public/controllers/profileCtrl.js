'use strict';

angular.module('MovIn')
  .controller('ProfileCtrl', function($scope, $rootScope, $http, $location, UserService, Upload, $timeout, $route, $window) {
    
    var placeSearch, autocomplete;
    $scope.formData = {};
    $scope.listingData = {};
    $scope.addedListing = [];
    $scope.editListing = false;
    $scope.place = null;
    $scope.files = null;
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
                // $scope.formData.gay = $scope.user.gay;
                $scope.formData.redditor = $scope.user.redditor;
                $scope.formData.live_sports = $scope.user.live_sports;
                $scope.formData.early_riser = $scope.user.early_riser;
                $scope.formData.night_owl = $scope.user.night_owl;
                $scope.formData.shopaholic = $scope.user.shopaholic;
                
                $scope.listingData.user_id = $scope.user._id;
                $http.get('/listing').then(function(data){
                    if(data.data){
                        for(var d in data.data){
                            $scope.addedListing.push(data.data[d]);
                            $scope.addedListing[d]["isopen"] = false;
                            $scope.addedListing[d]["editListing"] = false;
                        }
                    }
                    // console.log($scope.addedListing);
                });
            }else{
                $rootScope.nextPath = $location.path();
                $location.path('login');
            }
        });
    };

    $scope.saveProfile = function (formdata) {
		UserService.update(formdata).success(function(data) {
			// console.log("Received Data", data);
			$scope.user = data;
            $scope.message = "Profile Information Updated";
            $scope.success = true;
            $timeout(function () {
            $scope.success = false;
          }, 3000);
		}).error(function(status, data) {
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
        // console.log($scope.files);
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
                // $scope.message = response.data;
                $timeout(function () {
                    $scope.message = null;
                }, 3000);
            }, function (response) {
                if (response.status > 0) {
                    $scope.errorMsg = response.status + ': ' + response.data;
                }
            }, function (evt) {
                // $scope.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total, 10));
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
        formdata.img_url = [];
        if($scope.files){
            for(var i in $scope.files){
                formdata.img_url.push("../uploads/"+$scope.user._id+"-"+$scope.files[i].name);
            }
        }
        formdata.id = new Date().getTime();
        $scope.addedListing.push(formdata);
        UserService.addPlace(formdata).success(function(data) {
            // console.log(data);
            $scope.message = "Property Information Added";
            $scope.success = true;
            $timeout(function () {
            $scope.success = false;
          }, 3000);
        }).error(function(status, data) {
            $scope.error = true;
            $scope.message = "Failed. Please try again.";
            $timeout(function () {
            $scope.error = false;
          }, 3000);
        });
        $scope.aptInfo = !$scope.aptInfo;
        $scope.files = null;
        $scope.listingData = {};
    };

    $scope.updateListing = function (aptId) {
        for(var i in $scope.addedListing){
            if($scope.addedListing[i]._id === aptId){
                if($scope.files !== null || $scope.files !== undefined){
                    $scope.addedListing[i].img_url = [];
                    for(var j in $scope.files){
                        $scope.addedListing[i].img_url.push("../uploads/"+$scope.user._id+"-"+$scope.files[j].name);
                    }
                }
                var formData = $scope.addedListing[i];
                delete formData.$$hashKey;
                delete formData.__v;
                UserService.updPlace(formData).success(function(data) {
                    $scope.updMessage = "Property Information Updated";
                    $scope.updSuccess = true;
                    $timeout(function () {
                        $scope.updSuccess = false;
                    }, 3000);
                }).error(function(status, data) {
                    $scope.updError = true;
                    $scope.updMessage = "Failed. Please try again.";
                    $timeout(function () {
                        $scope.updError = false;
                    }, 3000);
                });
                // $scope.aptInfo = !$scope.aptInfo;
                // $scope.isopen = !$scope.isopen;
                $scope.files = null;
                $scope.addedListing[i].editListing = false;
            }
        }
    };

    $scope.deleteListing = function (aptId) {
        for(var i in $scope.addedListing){
            if($scope.addedListing[i]._id === aptId){
                if($scope.files !== null || $scope.files !== undefined){
                    $scope.addedListing[i].img_url = [];
                    for(var j in $scope.files){
                        $scope.addedListing[i].img_url.push("../uploads/"+$scope.user._id+"-"+$scope.files[j].name);
                    }
                }
                var formData = $scope.addedListing[i];
                delete formData.$$hashKey;
                delete formData.__v;
                $scope.addedListing.splice(i, 1);
                UserService.deletePlace(formData).success(function(data) {
                    $scope.updMessage = "Property Information Deleted";
                    $scope.updSuccess = true;
                    $timeout(function () {
                    $scope.updSuccess = false;
                  }, 3000);
                }).error(function(status, data) {
                    $scope.updError = true;
                    $scope.updMessage = "Failed. Please try again.";
                    $timeout(function () {
                    $scope.updError = false;
                  }, 3000);
                });
                $scope.aptInfo = !$scope.aptInfo;
                $scope.files = null;
            }
        }
    };

    $scope.init();
  });