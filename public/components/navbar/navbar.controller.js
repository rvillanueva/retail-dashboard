'use strict';

angular.module('socialApp')
  .controller('NavbarCtrl', function ($scope, $location, Auth) {
    $scope.menu = [{
      'title': 'Dashboard',
      'link': '/'
    },
    {
      'title': 'Map',
      'link': '/map'
    }];

    $scope.isCollapsed = true;
    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.isAdmin = Auth.isAdmin;
    $scope.getCurrentUser = Auth.getCurrentUser;

    $scope.logout = function() {
      Auth.logout();
      $location.path('/login');
    };

    $scope.isActive = function(route) {
      return route === $location.path();
    };
  });
