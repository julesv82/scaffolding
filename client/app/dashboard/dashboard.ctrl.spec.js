describe('DashboardCtrl', function() {
  var $scope, createController, $httpBackend, Auth, Dashboard, deferred;
  var adminUser = {
    _id: '1',
    name: 'Fake User',
    email: 'test@test.com',
    role: 'admin',
    connections: [
      { _id: '2', name: 'Fake User2', email: 'test2@test.com' }
    ]
  };

  var regUser = {
    _id: '2',
    name: 'Fake User2',
    email: 'test2@test.com',
    role: 'regularUser',
    connections: [
      { _id: '1', name: 'Fake User', email: 'test@test.com' }
    ]
  }

  var adminUsers = [
    adminUser,
    regUser,
    {
      _id: '3',
      name: 'Fake User3',
      email: 'test3@test.com',
      role: 'regularUser',
      connections: [
        { _id: '4', name: 'Fake User4', email: 'test4@test.com' },
        { _id: '5', name: 'Fake User5', email: 'test5@test.com' },
      ]
    },
    {
      _id: '4',
      name: 'Fake User4',
      email: 'test4@test.com',
      role: 'regularUser',
      connections: [
        { _id: '3', name: 'Fake User3', email: 'test3@test.com' },
        { _id: '5', name: 'Fake User5', email: 'test5@test.com' },
      ]
    },
    {
      _id: '5',
      name: 'Fake User5',
      email: 'test5@test.com',
      role: 'regularUser',
      connections: [
        { _id: '3', name: 'Fake User3', email: 'test3@test.com' },
        { _id: '4', name: 'Fake User4', email: 'test4@test.com' },
      ]
    }
  ]

  var regUsers = _.map(adminUsers, function(user){
    return _.omit(user, ['connections'])
  });

  Dashboard = {
    getUsersForRole: function(isAdmin){
      if(isAdmin){
        return adminUsers;
      }
      return regUsers;
    },
    connectUsers: function(){
      deferred = $q.defer();
      deferred.resolve();
      return deferred.promise;
    }
  };

  Auth = (function(){
    var cookie = {};
    var currentUser = {};
    return {
      login: function(user){
        cookie.token = user._id;
        currentUser = user;
      },
      requestCurrentUser: function(){
        return currentUser;
      },
      isLoggedIn: function(){
        return cookie._id;
      },
      logout: function(){
        cookie = {};
        currentUser = {};
      },
      isAdmin: function(){
        return currentUser.role === 'admin';
      }
    }
  })();

  beforeEach(module('userAuthApp'));

  beforeEach(inject(function ($injector, _$rootScope_, _$httpBackend_, $controller, _$location_, _$q_) {
    $location = _$location_;
    $httpBackend = _$httpBackend_;
    $q = _$q_;
    $scope = _$rootScope_.$new()

    createController = function() {
      return $controller('DashboardCtrl', {
        Dashboard: Dashboard,
        Auth: Auth,
        User: User,
        $scope: $scope
      });
    };

    $httpBackend.whenGET('app/account/login/login.html').respond(200);
    $httpBackend.whenGET('app/dashboard/dashboard.html').respond(200);

  }));

  afterEach(function() {
    Auth.logout();
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('init function will call the right functions', function() {
    Auth.login(adminUser);
    spyOn(Auth, 'requestCurrentUser');
    spyOn(Dashboard, 'getUsersForRole');
    createController();
    expect(Auth.requestCurrentUser).toHaveBeenCalled();
    expect(Dashboard.getUsersForRole).toHaveBeenCalled();
  });

  it('init will set the scope for admin', function(){
    Auth.login(adminUser);
    var ctrl = createController();
    expect(ctrl.currentUser).toEqual(adminUser);
    expect(ctrl.users).toEqual(adminUsers);
  });

  it('init will set the scope for reg user', function(){
    Auth.login(regUser);
    var ctrl = createController();
    expect(ctrl.currentUser).toEqual(regUser);
    expect(ctrl.users).toEqual(regUsers);
  });

  it('isConnected will return a boolean if the currentUser is connected', function(){
    Auth.login(adminUser);
    var ctrl = createController();
    expect(ctrl.isConnected('2')).toBe(true);
    expect(ctrl.isConnected('3')).toBe(false);
  });

  it('conect func will call Dashboard.connect which returns a promise', function(){
    Auth.login(adminUser);
    spyOn(Dashboard, 'connectUsers').and.callThrough();
    var ctrl = createController();
    spyOn(ctrl, 'init');
    ctrl.connect(adminUser._id);
    $scope.$digest();
    expect(Dashboard.connectUsers).toHaveBeenCalled();
    expect(ctrl.init).toHaveBeenCalled();
  });

});