'use strict';

angular.module('userAuthApp')
  .factory('User', function ($resource) {
    return $resource('api/users/:id', {
      id: '@_id'
    },
    {
      get: {
        method: 'GET',
        params: {
          id: 'me'
        }
      },
      getNotAdminUsers: {
        method: 'GET',
        params: {
          id: 'no-connections'
        },
        isArray: true
      }
    });
  });
