'use strict';

angular.module('socialApp')
  .filter('todayEvent', function () {
    return function (events) {
      var eventArray = []

      var now = new Date();
      var today = now.setDate(now.getDate());
      var tomorrow = now.setDate(now.getDate() + 1)

      angular.forEach(events, function(event, eKey){
        if (event.start_time > today && event.start_time < tomorrow && (event.end_time <= tomorrow || !event.end_time)){
          eventArray.push(event)
        }
      })
      return eventArray;
    };
  });
