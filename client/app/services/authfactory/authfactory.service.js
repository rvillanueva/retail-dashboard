'use strict';

angular.module('socialApp')
  .factory('authFactory', function ($q, $http) {
    // Service logic
    // ...

    // Public API here
    return {
      getMe: function () {
        var deferred = $q.defer();
        $http({
            url: ('api/users/me'),
            method: "GET",
         }).success(function(data) {
          deferred.resolve(data);
        })
        return deferred.promise;
      },
      saveStore: function (storeId) {
        var deferred = $q.defer();
        $http.post('/api/users/store', {
          store: storeId
        }).
         success(function(data) {
           console.log('store saved')
          deferred.resolve(data);
        })
        return deferred.promise;
      }
    };
  });
