'use strict';
let expect = require('chai').expect;
let app = require('../../app').app;
let User = require('./user.model');
let seed = require('../../config/seed');

let user = new User({
  _id: 7,
  name: 'Fake User',
  email: 'test@test.com',
  password: 'password',
  role: 'regularUser'
});

describe('User Model', function() {

  it('should fail when saving without an email', function(done) {
    user.email = '';
    user.save(function(err) {
      expect(err).to.exist;
      done();
    });
  });

  it("should authenticate user if password is valid", function() {
    expect(user.authenticate('password')).to.be.true;
  });

  it("should not authenticate user if password is invalid", function() {
    expect(user.authenticate('blah')).to.be.false;
  });

	it("should only allow user role to be regularUser or admin", function(done){
    let newUser = {
      name: 'John Egbert',
      email: 'johne@test.com',
      password: 'password',
      role: 'foobar'
    };
    newUser = new User(newUser);
    newUser.save(function(err, data){
      expect(err).to.exist;
      done();
    })
	});

});
