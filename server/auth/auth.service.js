'use strict';

var mongoose = require('mongoose');
var passport = require('passport');
var config = require('../config/environment');
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');
var compose = require('composable-middleware');
var validateJwt = expressJwt({ secret: config.secrets.session });
var _ = require('lodash');

var allowedRoles = config.allowedRoles;

module.exports = function(User) {
  /**
   * Attaches the user object to the request if authenticated
   * Otherwise returns 403
   */

  function isAuthenticated(req, res, next) {
    return compose()
    // Validate jwt
      .use(function(req, res, next) {
        // allow access_token to be passed through query parameter as well
        if(req.query && req.query.hasOwnProperty('access_token')) {
          req.headers.authorization = 'Bearer ' + req.query.access_token;
        }
        validateJwt(req, res, next);
      })
      // Attach user to request
      .use(function(req, res, next) {
        User.findById(req.user._id, function (err, user) {
          if (err) return next(err);
          if (!user) { return res.status(401); }
          req.user = user;
          next();
        });
      });
  }

  /**
   * Checks if the user role meets the minimum requirements of the route
   */
  function hasRole(role) {

    return compose()
      .use(isAuthenticated())
      .use(function(req, res, next) {
        if (req.user.role === role) {
          next();
        } else {
          res.status(403).end();
        }
      })
  }

  /**
   * Returns a jwt token signed by the app secret
   */
  function signToken(id) {
    return jwt.sign({ _id: id }, config.secrets.session, { expiresInMinutes: 60*5 });
  }

  return {
    isAuthenticated: isAuthenticated,
    hasRole: hasRole,
    signToken: signToken
  }
};
