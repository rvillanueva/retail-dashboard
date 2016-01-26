'use strict';

describe('Service: socialfactory', function () {

  // load the service's module
  beforeEach(module('socialApp'));

  // instantiate service
  var socialfactory;
  beforeEach(inject(function (_socialfactory_) {
    socialfactory = _socialfactory_;
  }));

  it('should do something', function () {
    expect(!!socialfactory).toBe(true);
  });

});
