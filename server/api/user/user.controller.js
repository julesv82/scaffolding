'use strict';

var User = require('./user.model');
var auth = require('../../auth/auth.service')();
let async = require('async');
let _ = require('lodash');


var validationError = function(res, err) {
  console.log(err);
  return res.status(422).json(err);
};

/**
 * Get list of users
 * restriction: 'admin'
 */
exports.index = function(req, res) {
  User.find({
    _id: {
      $ne: req.user._id
    }
  })
    .populate('connections', 'name email')
    .select('-salt -hashedPassword')
    .exec(function (err, users) {
      if(err) return res.status(500).send(err);
      res.status(200).json(users);
    });
};

/**
 * Get list of users
 * normal users
 */
exports.displayUsersWithoutConnections = function(req, res) {
  User.find({
    _id: {
      $ne: req.user._id
    }
  })
    .select('-salt -hashedPassword -connections -email_connections')
    .exec(function (err, users) {
      if(err) return res.status(500).send(err);
      res.status(200).json(users);
    });
};

/**
 * Creates a new user
 */
exports.create = function (req, res, next) {
  var newUser = new User(req.body);
  newUser.role = 'regularUser';
  newUser.save(function(err, user) {
    if (err) return validationError(res, err);
    var token = auth.signToken(user._id);
    user = user.getSafeUserObject(user);
    res.json({ token: token });
  });
};

exports.connect = function(req, res, next) {
  let id = req.params.id;

  async.waterfall([
    function(callback){
      User.findByIdAndUpdate(req.user._id,
        { $push: {"connections": id }},
        { safe: true, upsert: true }, function(err, model) {
          if(err) {
            return callback(err)
          }
          callback();
      });
    },
    function(callback){
      User.findByIdAndUpdate(id,
        { $push: {"connections": req.user._id }},
        { safe: true, upsert: true }, function(err, model) {
         if(err) {
          return callback(err)
         }
          callback();
      });
    }
  ],
  function(err){
    if(err) {
      res.status(500).send(err);
    } else {
      res.status(200).send({});
    }

  });
}



/**
 * Get my info
 */
exports.me = function(req, res, next) {
  var userId = req.user._id;
  User.findOne({
    _id: userId
  })
  .populate('connections', 'name _id email')
  .select('-salt -hashedPassword -token -email_connections')
  .exec(function(err, user) { // don't ever give out the password or salt
    if (err) return next(err);
    if (!user) return res.status(401).send('Unauthorized');
    res.json(user);
  });
};

/**
 * Authentication callback
 */
exports.authCallback = function(req, res, next) {
  res.redirect('/');
};
