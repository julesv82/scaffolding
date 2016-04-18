'use strict';

angular.module('userAuthApp')
  .controller('MainCtrl', function ($rootScope, $timeout) {
    var vm = this;

    vm.spinnerOptions = {
      backdrop: true,
      message: 'Please wait...',
      promise: []
    };

    $rootScope.$on('event:httpInterceptorSvc.promisesChange', (event, promises) => {
      // force to update the spinner
      delete vm.spinnerOptions.promise;

      $timeout(function () {
        vm.spinnerOptions.promise = promises;
      }, 0);
    });

  });