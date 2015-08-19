"use strict";

module.exports = function(grunt) {

    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-contrib-watch');

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
            js: {
                options: {
                    spawn: false
                },
                files: [
                    'models/**/*.js',
                    'routes/**/.js',
                    'bin/*.js',
                    'test/**/*.js'
                ],
                tasks: ['tdd']
            }
        }
    });

    grunt.registerTask('tdd', function(){
        grunt.task.run(['mochaTest', 'watch']);
    });

    grunt.registerTask('travis', 'mochaTest');
};