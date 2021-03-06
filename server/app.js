/**
 * Main application file
 */

'use strict';

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

// Error Handling
process.on('uncaughtException', function(err) {
  // handle the error safely
  console.error(err)
  console.error(err.stack);
  process.exit(-1);
});

let express = require('express');
let mongoose = require('mongoose');
let config = require('./config/environment');
let _ = require('lodash');

// Connect to database
mongoose.connect(config.mongo.uri, config.mongo.options);
mongoose.connection.on('error', function(err) {
    console.error('MongoDB connection error: ' + err);
    process.exit(-1);
  }
);

// Setup server
let app = express();
let server = require('http').createServer(app);
require('./config/express')(app);
require('./routes')(app);


function startServer() {
  server.listen(config.port, config.ip, function () {
    console.info(`Express server listening on ${config.port}, in ${app.get('env')} mode`);
  });
}

if(config.seedDb) {
  require('./config/seed')(function(){
    startServer();
  });
} else {
  startServer();
}

exports = module.exports = app;
