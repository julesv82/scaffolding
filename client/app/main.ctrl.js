'use strict';

angular.module('userAuthApp')
  .controller('MainCtrl', function ($scope) {
    var vm = this;

    vm.spinnerOptions = {
      backdrop: true,
      message: 'Please wait...',
      promise: [],
      minDuration: 100
    };

    $scope.$on('event:httpInterceptorSvc.promises.change', (event, promises) => {
      // force to update the spinner
      delete vm.spinnerOptions.promise;

      $timeout(function () {
        $scope.spinnerOptions.promise = promises;
      }, 0);
    });

  });