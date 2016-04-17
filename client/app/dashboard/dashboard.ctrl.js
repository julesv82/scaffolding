'use strict';

angular.module('userAuthApp')
  .controller('DashboardCtrl', function (Dashboard, Auth, User) {
    var vm = this;

    vm.init = function(){
      vm.currentUser = Auth.requestCurrentUser();
      vm.users = Dashboard.getUsersForRole(Auth.isAdmin());
    }

    vm.isConnected = function(userId){
      return _.some(vm.currentUser.connections, {_id: userId});
    }

    vm.connect = function(userId){
      Dashboard.connectUsers(userId).then(function(){
        vm.init();
      })
    }

    vm.isLoggedIn = function(){
      return Auth.isLoggedIn();
    }

    vm.init();
  });
