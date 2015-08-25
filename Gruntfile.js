"use strict";

module.exports = function(grunt) {

    require('jit-grunt')(grunt);

    grunt.initConfig({
        mochaTest: {
            test: {
                options: {
                    reporter: 'spec',
                    clearRequireCache: true
                },
                src: [
                    'test/test.config.js',
                    'test/**/*.js'
                ]
            }
        },
        watch: {
            options: {
                spawn: false
            },
            all: {
                files: [
                    'test/test.config.js',
                    'models/**/*.js',
                    'routes/**/*.js',
                    'bin/*.js',
                    'app.js',
                    'test/**/*.js',
                    'Gruntfile.js'
                ],
                tasks: [
                    'mochaTest',
                    'jshint:all',
                    'complexity:all'
                ]
            },
            codeAnalyzer:{
                files: [
                    'models/**/*.js',
                    'routes/**/*.js',
                    'bin/*.js',
                    'app.js',
                    'test/**/*.js',
                    'Gruntfile.js'
                ],
                tasks: [
                    'jshint:all',
                    'complexity:all'
                ]
            },
            tdd:{
                files: [
                    'test/test.config.js',
                    'models/**/*.js',
                    'routes/**/*.js',
                    'bin/*.js',
                    'app.js',
                    'test/**/*.js',
                    'Gruntfile.js'
                ],
                tasks: [
                    'mochaTest',
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
                    'app.js',
                    'test/**/*.js'
                ]
            }
        },
        complexity: {
            all: {
                src: [
                    'models/**/*.js',
                    'routes/**/*.js',
                    'bin/*.js',
                    'app.js',
                    'test/**/*.js'
                ],
                options: {
                    breakOnErrors: true,
                    errorsOnly: false,               // show only maintainability errors
                    cyclomatic: [5, 7, 12],
                    halstead: [20, 40, 50],
                    maintainability: 75,
                    hideComplexFunctions: false,     // only display maintainability
                    broadcast: true                  // broadcast data over event-bus
                }
            }
        }
    });
    
    grunt.registerTask('codeAnalyzer',function(){
        grunt.option('force', true);
        grunt.task.run(['jshint:all','complexity:all','watch:codeAnalyzer']);
    });

    grunt.registerTask('tdd', function(){
        grunt.option('force', true);
        grunt.task.run([
            'jshint:all',
            'mochaTest',
            'complexity:all',
            'watch:tdd'
        ]);
    });

    grunt.registerTask('travis', ['mochaTest','jshint:all','complexity:all']);
};