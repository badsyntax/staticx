'use strict';

module.exports = function(grunt) {
  grunt.initConfig(require('./grunt/config'));    // config
  require('load-grunt-tasks')(grunt, 'grunt-*');  // npm grunt tasks
  grunt.loadTasks('./grunt/tasks');               // custom grunt tasks
};
