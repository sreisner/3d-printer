module.exports = function(grunt) {
  'use strict';

  var path = require('path');

  grunt.initConfig({
    pkg: grunt.file.readJSON('./package.json'),
    eslint: {
      site: {
        files: {
          src: 'site/**/*.js'
        },
        options: {
          config: '.eslintrc.json'
        }
      },
      node: {
        files: {
          src: './*.js'
        },
        options: {
          config: '.eslintrc.json'
        }
      }
    },
    browserify: {
      all: {
        options: {
          transform: [
            ['babelify', {
              presets: ['es2015']
            }]
          ]
        },
        files: {
          './build/javascript/home.js': [
            './site/javascript/global.js',
            './site/modules/app.js',
            './site/modules/routes.js',
            './site/controllers/gallery-controller.js',
            './site/controllers/nav-controller.js',
            './site/directives/gallery-directive.js',
            './site/directives/nav-directive.js'
          ]
        }
      }
    },
    uglify: {
      all: {
        expand: true,
        cwd: './build/javascript',
        src: ['*.js'],
        dest: './dist/javascript/',
        ext: '.min.js'
      }
    },
    cssmin: {
      all: {
        files: [{
          expand: true,
          cwd: './site/css',
          src: ['*.css'],
          dest: './build/css/',
          ext: '.min.css'
        }]
      }
    },
    concat: {
      all: {
        files: {
          './dist/css/home.min.css': [
            './build/css/global.min.css',
            './build/css/nav.min.css',
            './build/css/gallery.min.css',
            './build/css/login.min.css',
            './build/css/form.min.css'
          ]
        }
      }
    },
    shell: {
      cleanup: {
        command: 'rm -rf ./build'
      }
    },
    /* eslint-disable camelcase */
    external_daemon: {
    /* eslint-enable camelcase */
      mongodb: {
        cmd: 'mongod',
        args: ['--dbpath=./data']
      }
    },
    watch: {
      scripts: {
        files: ['./site/**/*'],
        tasks: ['dev-build']
      }
    },
    express: {
      site: {
        options: {
          hostname: '127.0.0.1',
          port: 80,
          bases: path.resolve(__dirname, 'dist'),
          server: path.resolve(__dirname, 'index.js'),
          livereload: true
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-eslint');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-express');
  grunt.loadNpmTasks('grunt-shell-spawn');
  grunt.loadNpmTasks('grunt-external-daemon');

  grunt.registerTask('prod-build', [
    'browserify',
    'uglify',
    'cssmin',
    'concat',
    'shell:cleanup'
  ]);

  grunt.registerTask('dev-build', [
    'eslint:site',
    'eslint:node',
    'browserify',
    'uglify',
    'cssmin',
    'concat',
    'shell:cleanup'
  ]);

  grunt.registerTask('livereload', [
    'external_daemon:mongodb',
    'express:site',
    'watch'
  ]);
};
