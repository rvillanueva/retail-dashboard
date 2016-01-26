'use strict';

angular.module('socialApp')
  .factory('socialFactory', function ($q, $http, $timeout, authFactory) {
    // Service logic
    // ...

    var cache = {
      tweets: {
        retrieved: null,
        params: null,
        data: null
      },
      yelpCompetition: {
        retrieved: null,
        params: null,
        data: null
      },
      store: {
        retrieved: null,
        params: null,
        data: null
      },
      fbEvents: {
        retrieved: null,
        params: null,
        data: null
      }
    }

    var cacheTimeout = 120000

    var prettyDate = function(time){
    	var date = new Date((time || "").replace(/-/g,"/").replace(/[TZ]/g," ")),
    		diff = (((new Date()).getTime() - date.getTime()) / 1000),
    		day_diff = Math.floor(diff / 86400);

    	if ( isNaN(day_diff) || day_diff < 0 || day_diff >= 31 )
    		return;

    	return day_diff == 0 && (
    			diff < 60 && "just now" ||
    			diff < 120 && "1 minute ago" ||
    			diff < 3600 && Math.floor( diff / 60 ) + " minutes ago" ||
    			diff < 7200 && "1 hour ago" ||
    			diff < 86400 && Math.floor( diff / 3600 ) + " hours ago") ||
    		day_diff == 1 && "Yesterday" ||
    		day_diff < 7 && day_diff + " days ago" ||
    		day_diff < 31 && Math.ceil( day_diff / 7 ) + " weeks ago";
    }

    function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
      var R = 6371; // Radius of the earth in km
      var dLat = deg2rad(lat2-lat1);  // deg2rad below
      var dLon = deg2rad(lon2-lon1);
      var a =
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon/2) * Math.sin(dLon/2)
        ;
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      var d = R * c; // Distance in km
      return d;
    }

    function deg2rad(deg) {
      return deg * (Math.PI/180)
    }

    var twitterSearch = function(params, geo){
      var deferred = $q.defer();
      var now = new Date();
      console.log(params)
      console.log(cache)
      if(cache.tweets.retrieved < now - cacheTimeout || !cache.tweets.retrieved || params.geocode !== cache.tweets.params.geocode){
        $http({
            url: ('/api/twitter/search'),
            method: "GET",
            params: params,
         }).success(function(data) {
           var tweets = data;
           angular.forEach(tweets.statuses, function(tweet, tKey){
             var unparsed = tweet.created_at;
             tweet.created_at = new Date(unparsed);
             tweet.created_ago = prettyDate(unparsed);
             tweet.user.profile_url = "http://twitter.com/" + tweet.user.screen_name;
             if(geo && tweet.geo){
               var distance = getDistanceFromLatLonInKm(geo.lat, geo.long, tweet.geo.coordinates[0], tweet.geo.coordinates[1])
               tweet.geo.distance = distance * 0.621371
             }
           })
           cache.tweets = {
             retrieved: new Date(),
             params: params,
             data: data
           }
           deferred.resolve(tweets);
        })
      } else {
        deferred.resolve(cache.tweets.data)
      }
      return deferred.promise;
    }

    var fbAuth = function(){
      var deferred = $q.defer();
      $http({
          url: ('/api/facebook/auth'),
          method: "GET",
       }).success(function(data) {
         deferred.resolve(data);
       })
       return deferred.promise;
    }

    var fbEvents = function(params){
      var deferred = $q.defer();
      var now = new Date();
      var attempts = 0;
      console.log(params)
      var retrieve = function(params){
        console.log('retrieving events ' + attempts + " time")
        $http({
            url: ('/api/facebook/events'),
            method: "GET",
            params: params
         }).success(function(data) {
           console.log(data)
           if(data.data.length > 0){
             angular.forEach(data.data, function(event, eKey){
               event.original = {
                 start_time: event.start_time,
                 end_time: event.end_time
               }
               event.start_time = new Date(event.start_time);
               event.end_time = new Date(event.end_time);
             })
             cache.fbEvents = {
               retrieved: new Date(),
               params: params,
               data: data
             }
             deferred.resolve(data);
           //} else if (attempts < 1){
            // attempts ++;
            // $timeout(function(){retrieve(params)}, 2000);
           } else {
             console.log('rejecting')
             deferred.resolve(data)
           }
        })
      }

      if(cache.fbEvents.retrieved < now - cacheTimeout || !cache.fbEvents.retrieved || params.q !== cache.fbEvents.params.q){
        retrieve(params);
      } else {
        deferred.resolve(cache.fbEvents.data)
      }
       return deferred.promise;
    }

    var yelpSearch = function(params){
      var deferred = $q.defer();
      $http({
          url: ('/api/yelp/search'),
          method: "GET",
          params: params
       }).success(function(data) {
        deferred.resolve(data);
      })
       return deferred.promise;
    }

    var yelpBusiness = function(storeId){
      var deferred = $q.defer();
      var now = new Date();
      var params = {
        id: storeId
      }
      if(cache.store.retrieved < now - cacheTimeout || !cache.store.retrieved || storeId !== cache.store.params.id){
        $http({
            url: ('/api/yelp/business'),
            method: "GET",
            params: params
         }).success(function(data) {
           cache.store = {
             retrieved: new Date(),
             params: params,
             data: data
           }
          deferred.resolve(data);
        })
      } else {
        deferred.resolve(cache.store.data)
      }
       return deferred.promise;
    }



    // Public API here
    return {
      twitterSearch: function (params, geo) {
        var deferred = $q.defer();
        twitterSearch(params, geo).then(function(data){
          deferred.resolve(data)
        })
        return deferred.promise;
      },
      fbAuth: function () {
        var deferred = $q.defer();
        fbAuth().then(function(data){
          deferred.resolve(data);
        })
        return deferred.promise;
      },
      fbEvents: function (params) {
        var deferred = $q.defer();
        fbEvents(params).then(function(data){
          deferred.resolve(data)
        })
        return deferred.promise;
      },
      yelpSearch: function(params) {
        var deferred = $q.defer();
        yelpSearch(params).then(function(data){
          deferred.resolve(data)
        })
        return deferred.promise;
      },
      yelpBusiness: function(storeId) {
        console.log(storeId)
        var deferred = $q.defer();
        yelpBusiness(storeId).then(function(data){
          deferred.resolve(data)
        })
        return deferred.promise;
      },
      init: function(storeId) {
        console.log(storeId)
        var deferred = $q.defer();
        var response = {
          tweets: null,
          fbEvents: null,
          store: null
        }
        yelpBusiness(storeId).then(function(data){
          console.log(data);
          var store = data;
          response.store = store;
          var twitterParams = {
            q:'mcdonalds',
            geocode: '' + store.location.coordinate.latitude + ',' + store.location.coordinate.longitude + ',15mi'
          }
          var geoParams = {
            lat: store.location.coordinate.latitude,
            long: store.location.coordinate.longitude
          }
          twitterSearch(twitterParams, geoParams).then(function(data){
            console.log(data)
            response.tweets = data.statuses;
            authFactory.getMe().then(function(user){
              if (user.settings.fbtoken){
                var fbParams = {
                  token: user.settings.fbtoken,
                  q: '\"' + store.location.city + ', ' + store.location.state_code + '\"'
                }
                fbEvents(fbParams).then(function(events){
                  response.fbEvents = events.data;
                  console.log(events)
                  deferred.resolve(response)
                })
              } else {
                deferred.resolve(response)
              }
            })
          })

        })
        return deferred.promise;
      },
    };
  });
