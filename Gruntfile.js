'use strict';

module.exports = function(grunt) {

  // Catch unhandled exceptions and show the stack trace. This is most
  // useful when running the jasmine specs.
  process.on('uncaughtException',function(e) {
    grunt.log.error('Caught unhandled exception: ' + e.toString());
    grunt.log.error(e.stack);
  });

  // Set the config.
  grunt.initConfig(require('./grunt/config'));

  // Load the npm grunt tasks.
  require('load-grunt-tasks')(grunt, 'grunt-*');

  // Load our custom grunt tasks.
  grunt.loadTasks('./grunt/tasks');
};
