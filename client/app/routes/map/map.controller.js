'use strict';

angular.module('socialApp')
  .controller('MapCtrl', function ($scope, authFactory, socialFactory) {

    var map;

    function initialize() {
      var mapOptions = {
        center: { lat: 41.809623, lng: -87.991943},
        zoom: 14
      };
      map = new google.maps.Map(document.getElementById('map-canvas'),
          mapOptions);
    }

    $scope.tweets = []
    $scope.events = []
    $scope.poi = []

    var addTweet = function(geo, info, target){
      var position = new google.maps.LatLng(geo.lat,geo.long);
      var marker = new google.maps.Marker({
          position: position,
          map: map,
          animation: google.maps.Animation.DROP,
          icon: "/assets/images/tweet2.png",
          info: info
      });

      var infowindow = new google.maps.InfoWindow({
          content: info.body
      });
      google.maps.event.addListener(marker, 'click', function() {
        infowindow.open(map,marker);
      });

      $scope.tweets.push(marker)
    }

    var addEvent = function(geo, info, target){
      var position = new google.maps.LatLng(geo.lat,geo.long);
      var marker = new google.maps.Marker({
          position: position,
          map: map,
          title: info.title,
          animation: google.maps.Animation.DROP,
          //icon: "/assets/images/war.png",
          info: info
      });
      $scope.events.push(marker)
    }

    var addPoi = function(geo, info, target){
      var position = new google.maps.LatLng(geo.lat,geo.long);
      var marker = new google.maps.Marker({
          position: position,
          map: map,
          title: info.title,
          animation: google.maps.Animation.DROP,
          //icon: "/assets/images/war.png",
          info: info
      });
      $scope.poi.push(marker)
    }

    var addStore = function(geo, info, target){
      var position = new google.maps.LatLng(geo.lat,geo.long);
      var marker = new google.maps.Marker({
          position: position,
          map: map,
          title: info.title,
          animation: google.maps.Animation.DROP,
          //icon: "/assets/images/war.png",
          info: info
      });
      map.setCenter(marker.getPosition());
      $scope.store = marker;
    }

    $scope.init = function(storeId){
      socialFactory.init(storeId, $scope.user).then(function(data){
        console.log(data)
        $scope.tweets = data.tweets;
        $scope.store = data.store;
        $scope.fbEvents = data.fbEvents;
        var storeGeo = {
          lat: $scope.store.location.coordinate.latitude,
          long: $scope.store.location.coordinate.longitude
        }
        var storeInfo = {
          title: $scope.store.name,
          body: "" + $scope.store.location.address[0] + ", " + $scope.store.location.city + ", " + $scope.store.location.state_code
        }
        addStore(storeGeo, storeInfo)

        angular.forEach($scope.tweets, function(tweet, tKey){
          var geo = {
            lat: tweet.geo.coordinates[0],
            long: tweet.geo.coordinates[1]
          }
          var info = {
            title: tweet.user.name,
            body: tweet.text
          }
          addTweet(geo, info)
        });

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

    initialize();


  });
