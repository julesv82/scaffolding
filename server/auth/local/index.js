'use strict';

var express = require('express');
var passport = require('passport');
var AuthService = require('../auth.service');
var router = express.Router();
let auth = AuthService();

router.post('/', function(req, res, next) {
  passport.authenticate('local', function (err, user, info) {
    var error = err || info;
    if (error) return res.status(401).json(error);
    if (!user) return res.status(404).json({message: 'Something went wrong, please try again.'});

    var token = auth.signToken(user._id, user.role);
    let safeUser = user.getSafeUserObject(user);

    res.json({
      token: token,
      user: safeUser
    });
  })(req, res, next)
});

module.exports = router;
