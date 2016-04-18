/**
 * Main application routes
 */

'use strict';

var errors = require('./components/errors');
let path = require('path');

module.exports = function(app) {
  app.use('/api/users', require('./api/user'));
  app.use('/auth', require('./auth'));

  app.route('/:url(api|auth|components|app|bower_components|assets)/*')
   .get(errors[404]);

  // All other routes should redirect to the index.html
  app.route('/*')
    .get(function(req, res) {
      console.log('APPPATH===', app.get('appPath'))
      res.sendFile(path.resolve(app.get('appPath') + '/index.html'));
    });
};
