  'use strict';

var express = require('express');
var controller = require('./user.controller');
var config = require('../../config/environment');
var AuthService = require('../../auth/auth.service');
var User = require('./user.model');

let auth = AuthService(User);
var router = express.Router();

router.get('/', auth.hasRole('admin'), controller.index);
router.get('/no-connections', auth.isAuthenticated(), controller.displayUsersWithoutConnections)
router.get('/me', auth.isAuthenticated(), controller.me);
router.post('/', controller.create);
router.post('/connect/:id', auth.isAuthenticated(), controller.connect);

module.exports = router;
