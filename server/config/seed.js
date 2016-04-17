'use strict';

let User = require('../api/user/user.model');
let users = require('./users');
let async = require('async');
let _ = require('lodash');


function seed(callback) {
  let promises = [];
  let newUsers = [];
  User.find({}).remove(() => {
    users.forEach(function(user){
      newUsers.push(new User(user));
    });
    let emailRef = {}
    newUsers.forEach(function(newUser){
      emailRef[newUser.email] = newUser._id;
    });
    async.each(newUsers, function(newUser, cb){
      newUser.email_connections.forEach(function(email){
        newUser.connections.push(emailRef[email])
      });
      newUser.save(function(err, data){
        err ? cb(err) : cb()
      })
    }, function(err){
      if(err) {
        console.log('ERROR SEEDING...', err)
        callback(err)
      } else {
        callback();
      }
    })

  });
}

module.exports = seed;