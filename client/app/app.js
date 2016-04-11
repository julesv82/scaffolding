'use strict';

angular.module('userAuthApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'btford.socket-io',
  'ui.router',
  'ui.bootstrap',
  'toastr',
  'cgBusy',
  'angular.filter'
])
  .constant('_', window._) // lodash
  .config(function ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider, toastrConfig) {
    $locationProvider.html5Mode(true);
    $httpProvider.interceptors.push('authInterceptor');
    $httpProvider.interceptors.push('httpInterceptorSvc');
    // remove line below to show notifications
    angular.extend(toastrConfig, { maxOpened: -1 });
  })

  .factory('authInterceptor', function ($rootScope, $q, $cookieStore, $location) {
    return {
      // Add authorization token to headers
      request: function (config) {
        config.headers = config.headers || {};
        if ($cookieStore.get('token')) {
          config.headers.Authorization = 'Bearer ' + $cookieStore.get('token');
        }
        return config;
      },

      // Intercept 401s and redirect you to login
      responseError: function(response) {
        if (response.status === 401) {
          // remove any stale tokens
          $cookieStore.remove('token');
          $location.path('/login');
        }

        return $q.reject(response);
      }
    };
  })

  .run(function ($rootScope, $location, $q,
                 Auth, warmStartupSvc, httpInterceptorSvc) {
    warmStartupSvc.restart();
    $rootScope.ApplicationStarted = warmStartupSvc.currentItem.started;

    warmStartupSvc.getAllConfigs().then(response => {
      $rootScope.config = response.data;
    });

    $rootScope.$on('$stateChangeSuccess', function () {
      $anchorScroll();
    });

    httpInterceptorSvc.interceptUrlPatterns([
      /api\/.*$/i,
      /auth\/.*$/i
    ]);
  });
