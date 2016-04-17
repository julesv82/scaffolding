"use strict";


var $cookies,
    $httpBackend,
    User,
    adminUser = {
          name: 'Fake User',
          email: 'test@test.com',
          password: 'password',
          role: 'admin'
        },
    Auth;

describe("auth service; factory", function () {
  beforeEach(module('userAuthApp'));

  beforeEach(inject(function(_$httpBackend_, _User_, _$cookies_, _Auth_){
      $httpBackend = _$httpBackend_;
      $cookies = _$cookies_;
      User = _User_;
      Auth = _Auth_;
      $httpBackend.whenGET('app/account/login/login.html').respond(200);
      $httpBackend.whenGET('app/dashboard/dashboard.html').respond(200);
    })
  );

	describe('User.get()', function () {
		it('can get user', function () {
			$httpBackend.whenGET('api/users/me')
				.respond(adminUser);
			var result = User.get();
			$httpBackend.flush();
			expect(result).toBeDefined();
			expect(result.role).toEqual('admin');
		});
  });

  describe('Login', function(){
    it('should add a token to the cookies and populate currentUser', function(){
      $httpBackend.whenPOST('auth/local')
        .respond({ token: '1234', user: adminUser });
      Auth.login(adminUser);
      $httpBackend.flush();
      expect($cookies.get('token')).toBe('1234');
      expect(Auth.getCurrentUser()).toEqual(adminUser);
    });
  });

  describe('Logout', function(){
    it('should remove the token from the cookie and reset the currentUser', function(){
      Auth.logout();
      expect($cookies.get('token')).toEqual(undefined);
      expect(Auth.getCurrentUser()).toEqual({});
    });
  });

  describe('Create', function(){
    it('should add a token to the cookie and make a call to User.get()', function(){
      $httpBackend.whenPOST('api/users')
        .respond({ token: '1234', user: adminUser });
      $httpBackend.whenGET('api/users/me')
        .respond(adminUser);
      Auth.createUser(adminUser);
      $httpBackend.flush();
      expect($cookies.get('token')).toBe('1234');
      expect(Auth.getCurrentUser().role).toEqual('admin');
    });
  });

});


