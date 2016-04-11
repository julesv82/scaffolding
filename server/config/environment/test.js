'use strict';


// Test specific configuration
// ===========================
module.exports = {
  // MongoDB connection options
  mongo: {
    uri: 'mongodb://localhost/bbcitc-' + process.env.NODE_ENV
  },
  socket: {
    uri: "ws://localhost:9000"
  }
};
