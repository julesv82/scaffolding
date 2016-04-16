"use strict";


var $cookies,
    $httpBackend,
    User,
    adminUser = {
          name: 'Fake User',
          email: 'test@test.com',
          password: 'password',
          role: 'admin'
        };

describe("auth service; factory", function () {
  beforeEach(angular.mock.module('userAuthApp'));

	beforeEach(
		angular.mock.module(function($provide) {
			$provide.factory('Auth', function() {
				return {
					getCurrentUser : jasmine.createSpy('getCurrentUser').andCallFake(function(num) {
						return adminUser;
					}),
					currentUser: adminUser
				};
			});
		})
	);

  beforeEach(angular.mock.inject(function(_$httpBackend_, _User_, _$cookies_){
      $httpBackend = _$httpBackend_;
      $cookies = $cookies;
      User = _User_;
      console.log($cookies)
      $httpBackend.whenGET('app/account/login/login.html').respond(200);
      $httpBackend.whenGET('app/dashboard/dashboard.html').respond(200);
    })
  );

	describe('User.get()', function () {
		it('should call getUser with username', function () {
			$httpBackend.whenGET('api/users/me')
				.respond(adminUser);

			var result = User.get();
			$httpBackend.flush();
			expect(result).toBeDefined();
			expect(result.role).toEqual('admin');
		});
  });

  describe('Login', function(){
    it('should add a token to the cookies', function(){

    });
  });

});


