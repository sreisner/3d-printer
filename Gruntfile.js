module.exports = function(grunt) {
    'use strict';
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
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
                    './build/javascript/home.js': ['./site/javascript/global.js']
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
                        './build/css/gallery.min.css',
                        './build/css/nav.min.css'
                    ]
                }
            }
        },
        exec: {
            cleanup: 'rm -rf ./build'
        },
        watch: {
            scripts: {
                files: ['./site/**/*', './Gruntfile.js'],
                tasks: ['build']
            }
        }
    });

    grunt.loadNpmTasks('grunt-jslint');
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-exec');

    grunt.registerTask('build', [
        'jslint',
        'browserify',
        'uglify',
        'cssmin',
        'concat',
        'exec:cleanup'
    ]);
};
