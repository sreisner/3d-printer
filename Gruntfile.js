module.exports = function(grunt) {
    'use strict';

    var path = require('path');

    grunt.initConfig({
        pkg: grunt.file.readJSON('./package.json'),
        jslint: {
            client: {
                src: [
                    './site/javascript/*.js'
                ],
                directives: {
                    browser: true,
                    devel: true,
                    es6: true,
                    predef: ['$']
                }
            }
        },
        browserify: {
            all: {
                options: {
                    transform: [
                        ["babelify", {
                            "presets": ['es2015']
                        }]
                    ]
                },
                files: {
                    './build/javascript/home.js': ['./site/javascript/global.js'],
                    './build/javascript/login.js': ['./site/javascript/global.js']
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
                        './build/css/gallery.min.css'
                    ],
                    './dist/css/login.min.css': [
                        './build/css/global.min.css',
                        './build/css/nav.min.css',
                        './build/css/login.min.css',
                        './build/css/form.min.css'
                    ]
                }
            }
        },
        exec: {
            cleanup: 'rm -rf ./build'
        },
        watch: {
            scripts: {
                files: ['./site/**/*'],
                tasks: ['build']
            }
        },
        express: {
            all: {
                options: {
                    hostname: 'localhost',
                    port: 5001,
                    bases: path.resolve(__dirname, 'dist'),
                    server: path.resolve(__dirname, 'server.js'),
                    livereload: true
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-jslint');
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-express');
    grunt.loadNpmTasks('grunt-exec');

    grunt.registerTask('build', [
        'jslint',
        'browserify',
        'uglify',
        'cssmin',
        'concat',
        'exec:cleanup'
    ]);

    grunt.registerTask('livereload', ['express:all', 'watch']);
};
