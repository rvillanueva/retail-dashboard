'use strict';

describe('Service: authfactory', function () {

  // load the service's module
  beforeEach(module('socialApp'));

  // instantiate service
  var authfactory;
  beforeEach(inject(function (_authfactory_) {
    authfactory = _authfactory_;
  }));

  it('should do something', function () {
    expect(!!authfactory).toBe(true);
  });

});
