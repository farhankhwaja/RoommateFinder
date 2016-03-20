'use strict';
angular.module('RoommateFinder').factory('UserService', function ($http) {
    return {
        signIn: function(email, password) {
            console.log("got it", email, password);
            return $http.post( '/signin', {email : email, password: password});
        },

        logOut: function() {
            return $http.get('/signout');
        },

        register: function(formData) {
            return $http.post( '/register', formData);
        }
    }
});