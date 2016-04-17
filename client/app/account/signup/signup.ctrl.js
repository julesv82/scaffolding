'use strict';

angular.module('userAuthApp')
  .controller('SignupCtrl', function ($scope, Auth, $location) {
    var vm = this;
    vm.user = {};

    vm.register = function(form) {
      vm.submitted = true;

      if(form.$valid) {
        Auth.createUser({
          name: vm.user.name,
          email: vm.user.email,
          password: vm.user.password
        })
        .then( function() {
          // Account created, redirect to home
          $location.path('/');
        })
        .catch( function(err) {
          err = err.data;
          vm.errors = {};
        });
      }
    };

  });