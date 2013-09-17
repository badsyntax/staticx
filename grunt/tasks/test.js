'use strict';

module.exports = function(grunt) {
  grunt.registerTask('test', 'Run code tests.', [
    'jasmine_node'
  ]);
};
