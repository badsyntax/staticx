'use strict';

module.exports = function(grunt) {
  grunt.registerTask('build', 'Build the theme', [
    'lint',
    'compass:dev'
  ]);
};
