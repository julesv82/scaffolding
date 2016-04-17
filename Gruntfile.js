// Generated on 2016-04-08 using generator-angular-fullstack 3.3.0-beta.0
'use strict';

module.exports = function (grunt) {
  var localConfig;
  try {
    localConfig = require('./server/config/local.env');
  } catch(e) {
    localConfig = {};
  }

  // Load grunt tasks automatically, when needed
  require('jit-grunt')(grunt, {
    express: 'grunt-express-server',
    protractor: 'grunt-protractor-runner'
  });

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // Define the configuration for all the tasks
  grunt.initConfig({

    watch: {
      injectJS: {
        files: [
          'client/{app,components}/**/!(*.spec|*.mock).js',
          '!client/app/app.js'
        ],
        tasks: ['injector:scripts']
      },
      mochaTest: {
        files: ['server/**/*.{spec,integration}.js'],
        tasks: ['env:test', 'mochaTest']
      },
      jsTest: {
        files: ['client/{app,components}/**/*.{spec,mock}.js'],
        tasks: ['wiredep:test', 'karma']
      },
      gruntfile: {
        files: ['Gruntfile.js']
      },
      livereload: {
        files: [
          'client/{app,components}/**/*.{css,html}',
          'client/{app,components}/**/!(*.spec|*.mock).js',
          'client/assets/images/{,*//*}*.{png,jpg,jpeg,gif,webp,svg}'
        ],
        options: {
          livereload: true
        }
      },
      express: {
        files: ['server/**/*.{js,json}'],
        tasks: ['express:dev', 'wait'],
        options: {
          livereload: true,
          spawn: false //Without this option specified express won't be reloaded
        }
      }
    },

    filerev: {
      dist: {
        src: [
          'client/!(bower_components){,*/}*.{js,css}',
          'client/assets/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
          'client/assets/fonts/*'
        ]
      }
    },

    express: {
      options: {
        port: process.env.PORT || 9000
      },
      dev: {
        options: {
          script: 'server/app.js',
          debug: true
        }
      },
      prod: {
        options: {
          script: 'dist/server'
        }
      }
    },

    open: {
      server: {
        url: 'http://localhost:<%= express.options.port %>'
      }
    },


    // Automatically inject Bower components into the app and karma.conf.js
    wiredep: {
      options: {
        exclude: [
          /bootstrap.js/,
          '/json3/',
          '/es5-shim/',
          /font-awesome\.css/,
          /bootstrap\.css/,
          /bootstrap-sass-official/
        ]
      },
      client: {
        src: 'client/index.html',
        ignorePath: 'client/',
      },
      test: {
        src: './karma.conf.js',
        devDependencies: true
      }
    },

    mochaTest: {
      options: {
        reporter: 'spec',
        require: 'mocha.conf.js',
        timeout: 5000 // set default mocha spec timeout
      },
      unit: {
        src: ['server/**/*.spec.js']
      }
    },

    karma: {
      unit: {
        configFile: 'karma.conf.js',
        singleRun: true
      }
    },

    protractor: {
      options: {
        configFile: 'protractor.conf.js'
      },
      chrome: {
        options: {
          args: {
            browser: 'chrome'
          }
        }
      }
    },

    env: {
      test: {
        NODE_ENV: 'test'
      },
      prod: {
        NODE_ENV: 'production'
      },
      all: localConfig
    },

    injector: {
      scripts: {
        options: {
          transform: function(filePath) {
            var yoClient = 'client';
            filePath = filePath.replace('/' + yoClient + '/', '');
            return '<script src="' + filePath + '"></script>';
          },
          sort: function(a, b) {
            var module = /\.module\.js$/;
            var aMod = module.test(a);
            var bMod = module.test(b);
            // inject *.module.js first
            return (aMod === bMod) ? 0 : (aMod ? -1 : 1);
          },
          starttag: '<!-- injector:js -->',
          endtag: '<!-- endinjector -->'
        },
        files: {
          'client/index.html': [
            [
             'client/{app,components}/**/!(*.spec|*.mock).js',
             '!{.tmp,client}/app/app.{js,ts}'
            ]
          ]
        }
      }
    }

  });


  grunt.registerTask('test', function(target) {
    if (target === 'server') {
      return grunt.task.run([
        'env:all',
        'env:test',
        'injector:scripts',
        'mochaTest'
      ]);
    }

    else if (target === 'client') {
      return grunt.task.run([
        'env:all',
        'injector:scripts',
        'wiredep:test',
        'karma'
      ]);
    }

    else grunt.task.run([
      'test:server',
      'test:client'
    ]);
  });

  grunt.registerTask('wait', function () {
    grunt.log.ok('Waiting for server reload...');

    var done = this.async();

    setTimeout(function () {
      grunt.log.writeln('Done waiting!');
      done();
    }, 1500);
  });

  grunt.registerTask('default', [
    'env:all',
    'injector',
    'wiredep:client',
    'express:dev',
    'wait',
    'open',
    'watch'
  ]);

  grunt.registerTask('build', [
    'env:all',
    'injector',
    'wiredep:client',
  ])

};
