'use strict';

angular.module('userAuthApp')
  .controller('LoginCtrl', function (Auth, $location, $scope) {
    var vm = this;
    vm.user = {};

    vm.login = function(form) {
      vm.submitted = true;

      if(form.$valid) {
        Auth.login({
          email: vm.user.email,
          password: vm.user.password
        })
        .then( function(user) {
          // Logged in, redirect to home
          $location.path('/');
        })
        .catch( function(err) {
          vm.errors = err.message;
        });
      }
    };

  });