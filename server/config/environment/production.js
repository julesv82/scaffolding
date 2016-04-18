'use strict';


// Production specific configuration
// =================================
module.exports = {
  // Server IP
  ip:       process.env.IP ||
            undefined,

  // force no debug in production environment
  debug: process.env.DEBUG || '',

  // Server port
  port:     process.env.PORT ||
            8080,

  // MongoDB connection options
  mongo: {
    uri:    process.env.MONGOLAB_URI ||
            'mongodb://localhost/userAuthApp'
  },
  socket: {
    uri: ''
  },
  seedDb: true
};
