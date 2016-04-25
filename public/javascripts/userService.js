'use strict';
angular.module('MovIn').factory('UserService', function ($http) {
    return {
        signIn: function(email, password) {
            return $http.post( '/signin', {email : email, password: password});
        },

        logOut: function() {
            return $http.get('/signout');
        },

        register: function(formData) {
            return $http.post( '/register', formData);
        },

        update: function(formData) {
            return $http.put('/users/'+ formData._id, formData);
        },

        addPlace: function(formData) {
            return $http.post('/listing/'+formData.user_id, formData);
        },

        updPlace: function(formData) {
            return $http.put('/listing/'+formData._id, formData);
        },

        deletePlace: function(formData) {
            return $http.delete('/listing/'+formData._id, formData);
        }
    };
});