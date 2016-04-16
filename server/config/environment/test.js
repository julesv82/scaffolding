'use strict';


// Test specific configuration
// ===========================
module.exports = {
  // MongoDB connection options
  mongo: {
    uri: 'mongodb://localhost/userAuthApp-' + process.env.NODE_ENV
  },
  socket: {
    uri: "ws://localhost:9000"
  },
  seedDb: false
};
