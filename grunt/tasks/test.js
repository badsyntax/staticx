'use strict';

module.exports = function(grunt) {
  grunt.registerTask('test', 'Run code tests.', [
    'lint',
    'jasmine_node'
  ]);
};
