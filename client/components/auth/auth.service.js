'use strict';

angular.module('userAuthApp')
  .factory('Auth', function Auth($state, $rootScope, $http, User, $cookies, $q, _) {
    var currentUser = {};

    if($cookies.get('token')) {
      currentUser = User.get();
    }

    return {

      /**
       * Authenticate user and save token
       *
       * @param  {Object}   user     - login info
       * @return {Promise}
       */
      login: function(user) {
        var deferred = $q.defer();

        $http.post('/auth/local', {
          email: user.email,
          password: user.password
        })
        .then(function(response) {
          var data = response.data;
          $cookies.put('token', data.token);
          currentUser = data.user;
          deferred.resolve(data);
        })
        .catch(function(response) {
          var err = response.data;
          this.logout();
          deferred.reject(err);
        }.bind(this));

        return deferred.promise;
      },

      /**
       * Delete access token and user info
       *
       * @param  {Function}
       */
      logout: function() {
        $cookies.remove('token');
        currentUser = {};
      },

      /**
       * Create a new user
       *
       * @param  {Object}   user     - user info
       * @return {Promise}
       */
      createUser: function(user) {
        var deferred = $q.defer();

        User.save(user,
          function(data) {
            $cookies.put('token', data.token);
            currentUser = User.get();
            deferred.resolve(user);
          },
          function(err) {
            this.logout();
            deferred.reject(err);
          }.bind(this));

        return deferred.promise;
      },

       /**
        * Check if a user is an admin
        *
        * @return {Boolean}
       */
      isAdmin: function() {
        return currentUser.role === 'admin';
      },

      isLoggedIn: function() {
        return $cookies.get('token');
      },

      /**
       * Waits for currentUser to resolve before checking if user is logged in
       */
      getCurrentUser: function() {
        return currentUser;
      }
    };

  });
