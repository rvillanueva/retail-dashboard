'use strict';

angular.module('socialApp')
  .controller('SelectModalInstanceCtrl', function ($scope, $http, $modalInstance, socialFactory) {

    $scope.ok = function () {
      $modalInstance.close($scope.store);
    };

    $scope.select = function(store){
      $modalInstance.close(store);
    }

    $scope.search = function(){
      if($scope.location){
        var yelpParams = {
          term:'mcdonalds',
          location: $scope.location
        }
        socialFactory.yelpSearch(yelpParams).then(function(data){
          console.log(data)
          $scope.searchData = data;
          $scope.stores = data.businesses;
        })
      } else {
        alert('Please enter a location!')
      }

    }

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };

    $scope.clear = function () {
      $scope.addText.date = null;
    };

    $scope.open = function($event) {
      $event.preventDefault();
      $event.stopPropagation();

      $scope.opened = true;
    };

  });
