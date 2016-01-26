'use strict';

angular.module('socialApp')
  .controller('MainCtrl', function ($scope, $http, socialFactory, authFactory, $modal, $window) {

    $scope.now = new Date();
    $scope.day = $scope.now.getDay();
    $scope.today = $scope.now.setDate($scope.now.getDate());
    $scope.tomorrow = $scope.now.setDate($scope.now.getDate() + 1)
    $scope.init = function(storeId){
      socialFactory.init(storeId, $scope.user).then(function(data){
        console.log(data)
        $scope.tweets = data.tweets;
        $scope.store = data.store;
        $scope.fbEvents = data.fbEvents;
      })
    }

    authFactory.getMe().then(function(user){
      console.log(user);
      $scope.user = user;
      if(!$scope.user.settings){
        $scope.user.settings = {}
      }
      if ($scope.user.settings.store) {
        $scope.storeSelected = true;
        $scope.init($scope.user.settings.store);
      } else {
        $scope.storeSelected = false;
      }
    })

    $scope.getEvents = function(){
      authFactory.getMe().then(function(user){
        var params = {
          token: user.fbtoken
        }
        socialFactory.fbEvents(params).then(function(data){
          $scope.fbEvents = data;
          console.log(data)
        })
      })
    }

    $scope.fbAuth = function(){
      socialFactory.fbAuth()
    }

    $scope.loginOauth = function(provider) {
      $window.location.href = '/auth/' + provider;
    };

    $scope.storeSelect = function(){
      var modalInstance = $modal.open({
       templateUrl: '../components/selectmodal/selectmodal.html',
       controller: 'SelectModalInstanceCtrl',
       size: 'lg',
       backdrop: true,
      })

      modalInstance.result.then(function (storeId) {
        if (storeId){
          console.log(storeId)
          $scope.storeSelected = true;
          $scope.init(storeId);
          authFactory.saveStore(storeId)
        }
      });
    }
  });
