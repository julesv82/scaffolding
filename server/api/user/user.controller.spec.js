'use strict';

let expect = require('chai').expect;
let mocks = require('node-mocks-http');
let User = require('./user.model');
let controller = require('./user.controller');
let request = require('supertest');
let seed = require('../../config/seed');
let app = require('../../app');
let jwt = require('jsonwebtoken');
let secret = require('../../config/environment').secrets.session;

describe('user controller', function(done){
  let admin;
  let user;
  let adminToken;
  let userToken;
  let res = mocks.createResponse();

  function signToken(id){
    return jwt.sign({ _id: id }, secret, { expiresIn: 60*5 })
  }

  before(function(done){
    seed(function(){
      User.findOne({role: 'admin'})
        .exec(function(err, data){
          admin = data;
          adminToken = signToken(admin._id)
          User.findOne({role: 'regularUser'})
            .exec(function(err, data){
              user = data;
              userToken = signToken(user._id);
              done();
            })
        })
    })
  });

  context('api', function(){

    it('index will return an array and the correct fields of the user objects', function(done){
      request(app)
        .get('/api/users')
        .set('Authorization', 'Bearer ' + adminToken)
        .expect(200)
        .end(function(err, res){
          if (err) throw err;
          expect(res.body).to.be.an.array
          expect(res.body[0]).to.not.include.keys(['salt', 'hashedPassword'])
          expect(res.body[0].connections).to.not.include.keys(['salt', 'hashedPassword', 'connections', 'email_connections'])
          done()
        });
    });

    it('me will return the current user', function(done){
      request(app)
        .get('/api/users/me')
        .set('Authorization', 'Bearer ' + adminToken)
        .expect(200)
        .end(function(err, res){
          if (err) throw err;
          expect(res.body).to.be.an.object;
          expect(res.body._id.toString()).to.equal(admin._id.toString());
          expect(res.body).to.not.include.keys(['salt', 'hashedPassword', 'token', 'email_connections']);
          expect(res.body.connections).to.not.include.keys(['salt', 'hashedPassword', 'token', 'email_connections']);
          done();
        });
    });

    it('displayUsersWithoutConnections', function(done){
      request(app)
        .get('/api/users/no-connections')
        .set('Authorization', 'Bearer ' + adminToken)
        .expect(200)
        .end(function(err, res){
          if(err) throw err;
          expect(res.body).to.be.an.array
          expect(res.body[0]).to.not.include.keys(['salt', 'hashedPassword', 'connections'])
          done();
        })
    });

    it('create', function(done){
      request(app)
        .post('/api/users/')
        .send({
          name: 'John Bob',
          email: 'john.bob@test.com',
          password: 'johnbob2016'
        })
        .expect(200)
        .end(function(err, res){
          if(err) throw err;
          expect(res.body).to.be.an.object;
          expect(res.body).to.include.keys(['token']);
          User.findOne({email: 'john.bob@test.com'}).exec(function(err, user){
            expect(user.email).to.equal('john.bob@test.com');
            done();
          })
        })
    });

    it('connect', function(done){
      request(app)
        .post('/api/users/connect/' + user._id)
        .set('Authorization', 'Bearer ' + adminToken)
        .expect(200)
        .end(function(err, res){
          if(err) throw err;
          expect(res.body).to.be.an.object;
          done();
        })
    });
  });

  context('auth', function(){
    it('get user index route requires an authorised user', function(done){
      request(app)
        .get('/api/users')
        .set('Authorization', 'Bearer ' + userToken)
        .expect(403)
        .end(function(err, res){
          if(err) throw err;
          done()
        })
    })
  });
});