"use strict";

var config = require('../../../shared/config'),
  $httpBackend,
  User;

describe("auth service; factory", function () {
  beforeEach(angular.mock.module('bbcItcApp'));

	beforeEach(
		angular.mock.module(function($provide) {
			$provide.factory('Auth', function() {
				var u = {
					provider: 'local',
					name: 'Fake User',
					email: 'test@test.com',
					password: 'password',
					roles:['itc']
				};
				return {
					getCurrentUser : jasmine.createSpy('getCurrentUser').andCallFake(function(num) {
						return u;
					}),
					currentUser: u
				};
			});
		})
	);

  beforeEach(angular.mock.inject(
    (_$httpBackend_, _User_) => {
      $httpBackend = _$httpBackend_;
      User = _User_;

      $httpBackend.whenGET('app/account/login/login.html').respond(200);
      $httpBackend.whenGET('app/dashboard/dashboard.html').respond(200);
      $httpBackend.whenGET('api/configs/all').respond(config);
    })
  );

	describe('User.get()', function () {
		it('should call getUser with username', function () {
			$httpBackend.whenGET('api/users/me')
				.respond({
				provider: 'local',
				name: 'Fake User',
				email: 'test@test.com',
				password: 'password',
				roles:['guest']
			});

			var result = User.get();
			$httpBackend.flush();
			expect(result).toBeDefined();
			expect(result.roles[0]).toEqual('guest');
		});
	});


	// // function Auth($location, $rootScope, $http, User, $cookieStore, $q) {
	// Factory of interest is called MyFactory
	describe('factory: Auth', function() {
		var factory = null;
		beforeEach(inject(function(Auth) {
			factory = Auth;
		}));


		//Getting reference of the mocked service
//		it('cannot access currentUser Externally', function(){
//			factory.isAdmin();
//		});

		it('Should define methods', function() {
			expect(factory.getCurrentUser).toBeDefined()
			expect(factory.getCurrentUser).toEqual(jasmine.any(Function))
		});
	});

	describe("role identification in a factory: Auth", function(){
		angular.mock.module(function($provide) {
			$provide.factory('Auth', function() {
				return this.getCurrentUser = jasmine.createSpy('getCurrentUser').andCallFake(function(num) {
					return {
						provider: 'local',
						name: 'Fake User',
						email: 'test@test.com',
						password: 'password',
						roles:['guest']
					};
				});
			});
		});
	});
});

/*

describe('getCustomers', function () {
			it("should return a list of customers", inject(function () {
				factory
				_httpBackend.expectGET('/Home/Customers').respond(['david', 'James', 'Sam']);
				_service.getCustomers(function (result) {
					expect(result).toEqual(["david", "James", "Sam"]);
				});
				_httpBackend.flush();
			}))
		});

		var Auth, _httpBackend;
		beforeEach(function () {
			angular.mock.inject(function ($injector) {
				_httpBackend = $injector.get('$httpBackend');
				Auth = $injector.get('Auth');
				_cookieStore = $injector.get('$cookieStore');
			})
		});



describe("auth service; factory", function () {
  var redditService, httpBackend;

  beforeEach(module("bbcItcApp"));

	 // Factory of interest is called MyFactory
  describe('factory: Auth', function() {
    var factory = null;
    beforeEach(inject(function(Auth) {
      factory = Auth;
    }));
		  var $controller;
  beforeEach(inject(function(_$controller_) {
    $controller = _$controller_;
  }));
    it('Should define methods', function() {
      expect(factory.beAwesome).toBeDefined()
      expect(factory.beAwesome).toEqual(jasmine.any(Function))
    });
  });

	// Setup the mock service in an anonymous module.
  beforeEach(module(function ($provide) {
    $provide.value('Auth', {
        someVariable: 1
    });
  }));

});

*/
