'use strict';

angular.module('userAuthApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ui.router',
  'cgBusy'
])
  .constant('_', window._) // lodash
  .config(function ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {
    $urlRouterProvider.otherwise('/dashboard');
    $locationProvider.html5Mode(true);
    $httpProvider.interceptors.push('authInterceptor');
  })

  .factory('authInterceptor', function ($rootScope, $q, $cookies, $location) {
    return {
      // Add authorization token to headers
      request: function (config) {
        config.headers = config.headers || {};
        if ($cookies.get('token')) {
          config.headers.Authorization = 'Bearer ' + $cookies.get('token');
        }
        return config;
      },

      // Intercept 401s and redirect you to login
      responseError: function(response) {
        if (response.status === 401) {
          // remove any stale tokens
          $cookies.remove('token');
          $location.path('/login');
        }

        return $q.reject(response);
      }
    };
  });
