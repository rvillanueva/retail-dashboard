'use strict';

describe('Filter: todayEvent', function () {

  // load the filter's module
  beforeEach(module('socialApp'));

  // initialize a new instance of the filter before each test
  var upcomingEvent;
  beforeEach(inject(function ($filter) {
    upcomingEvent = $filter('todayEvent');
  }));

  it('should return the input prefixed with "upcomingEvent filter:"', function () {
    var text = 'angularjs';
    expect(upcomingEvent(text)).toBe('upcomingEvent filter: ' + text);
  });

});
