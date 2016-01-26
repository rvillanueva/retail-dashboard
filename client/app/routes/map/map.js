'use strict';

angular.module('socialApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/map', {
        templateUrl: 'app/routes/map/map.html',
        controller: 'MapCtrl'
      });
  });
