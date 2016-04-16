'use strict';

angular.module('userAuthApp')
  .controller('HeaderCtrl', function ($scope, $location, Auth, $rootScope, $state) {
    var vm = this;
    vm.logout = function() {
      Auth.logout();
      $location.path('/login');
    };

    vm.showUserName = function(){
      vm.currentUser = Auth.getCurrentUser();
      return Auth.getCurrentUser().name;
    }
  });
