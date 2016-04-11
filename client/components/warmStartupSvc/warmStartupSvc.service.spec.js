'use strict';

var config = require('../../../shared/config');

describe('Service: warmStartupSvc', () => {
	// instantiate service
  var warmStartupSvc,
			$httpBackend;

  // load the service's module
  beforeEach(angular.mock.module('bbcItcApp'));

	beforeEach(inject((_$httpBackend_, _warmStartupSvc_) => {
		$httpBackend = _$httpBackend_;
    warmStartupSvc = _warmStartupSvc_;

		$httpBackend.expectGET('/api/configs/all').respond(config);
  }));

	it('should call remote endpoint to load all configs', () => {
		warmStartupSvc.getAllConfigs()
      .then(data => {
        $httpBackend.flush();
        expect(data).toBe(config);
      });
	});
});
