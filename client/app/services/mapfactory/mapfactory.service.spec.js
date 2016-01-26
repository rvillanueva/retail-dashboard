'use strict';

describe('Service: mapfactory', function () {

  // load the service's module
  beforeEach(module('socialApp'));

  // instantiate service
  var mapfactory;
  beforeEach(inject(function (_mapfactory_) {
    mapfactory = _mapfactory_;
  }));

  it('should do something', function () {
    expect(!!mapfactory).toBe(true);
  });

});
