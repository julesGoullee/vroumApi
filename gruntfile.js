"use strict";

module.exports = function(grunt) {

    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-jshint');

    grunt.initConfig({
        mochaTest: {
            test: {
                options: {
                    reporter: 'spec',
                    clearRequireCache: true
                },
                src: ['test/**/*.js']
            }
        },
        watch: {
            options: {
                spawn: false
            },
            all: {
                files: [
                    'models/**/*.js',
                    'routes/**/*.js',
                    'bin/*.js',
                    'app.js',
                    'test/**/*.js',
                    'gruntfile.js'
                ],
                tasks: [
                    'jshint:all',
                    'mochaTest'
                ]
            },
            jshint:{
                files: [
                    'models/**/*.js',
                    'routes/**/*.js',
                    'bin/*.js',
                    'app.js',
                    'test/**/*.js',
                    'gruntfile.js'
                ],
                tasks: [
                    'jshint:all'
                ]
            }
        },
        jshint: {
            options: {
                jshintrc: '.jshintrc',
                reporter: require('jshint-stylish')
            },
            all: {
                src: [
                    'models/**/*.js',
                    'routes/**/*.js',
                    'bin/*.js',
                    'test/**/*.js'
                ]
            }
        }
    });

    grunt.registerTask('codeAnalyzer',function(){
        grunt.option('force', true);
        grunt.task.run(['jshint:all','watch:jshint']);
    });

    grunt.registerTask('tdd', function(){
        grunt.option('force', true);
        grunt.task.run([
            'jshint:all',
            'mochaTest',
            'watch:all'
        ]);
    });

    grunt.registerTask('travis', ['jshint:all','mochaTest']);
};