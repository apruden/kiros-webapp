'use strict';

describe('Controller: AboutCtrl', function () {

  // load the controller's module
  beforeEach(module('kirosWebApp'));

  var AboutCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AboutCtrl = $controller('AboutCtrl', {
      $scope: scope
    });
  }));

  it('dummy test', function () {
    expect(1).toBe(1);
  });
});
