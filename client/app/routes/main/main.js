'use strict';

angular.module('socialApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'app/routes/main/main.html',
        controller: 'MainCtrl'
      });
  });
