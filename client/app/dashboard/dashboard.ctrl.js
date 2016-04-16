'use strict';

angular.module('userAuthApp')
  .controller('DashboardCtrl', function ($scope, $state, $http, Dashboard, Auth, User) {
    var vm = this;
    vm.currentUser = User.get();
    vm.users = Dashboard.getUsersForRole(Auth.isAdmin());

    vm.isConnected = function(userId){
      return _.some(vm.currentUser.connections, {_id: userId});
    }

    vm.connect = function(userId){
      Dashboard.connectUsers(userId).then(function(users){
        vm.currentUser = User.get();
        vm.users = Dashboard.getUsersForRole(Auth.isAdmin());
      })
    }
  });
