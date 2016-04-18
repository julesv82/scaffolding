angular.module('userAuthApp')
  .factory('httpInterceptorSvc', ($rootScope, $q) => {
    var promises = [],
        promisesMap = {}

    function addPromise(url) {
      var deferred = $q.defer();
      promisesMap[url] = deferred;
      promises.push(deferred.promise);
      notify();
    }

    function removePromise(url) {
      var deferred = promisesMap[url];

      if (deferred) {
        var promiseIdx = promises.indexOf(deferred.promise);

        deferred.resolve();
        promises.splice(promiseIdx, 1);
        delete _promisesMap[url];
        notify();
      }
    }

    function notify() {
      $rootScope.$broadcast('event:httpInterceptorSvc.promisesChange', promises);
    }

    return {
      request: function (config) {
        addPromise(config.url);
        return config;
      },
      response: function (response) {
        if (response && response.config) {
          removePromise(response.config.url);
        }
        return response;
      },
      responseError: function (response) {
        if (response && response.config) {
          removePromise(response.config.url);
        }
        return $q.reject(response);
      }
    };
  });
