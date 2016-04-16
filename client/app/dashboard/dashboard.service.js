'use strict';

angular.module('userAuthApp')
  .factory('Dashboard', function Auth($state, $rootScope, $http, User, $cookies, $q, _) {
    function getUsersForRole(isAdmin){
      if(isAdmin) {
        return User.query();
      }
      return User.getNotAdminUsers();
    }

    function connectUsers(userId) {
      var deferred = $q.defer();
      return $http.post('/api/users/connect/' + userId)
        .success(function(data){
          deferred.resolve(data);
          return deferred.promise
        })
        .catch(function(err){
          deferred.reject(err);
          return deferred.promise
        })
    }

    return {
      getUsersForRole: getUsersForRole,
      connectUsers: connectUsers
    };

  });
