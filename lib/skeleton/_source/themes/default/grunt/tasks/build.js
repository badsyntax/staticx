'use strict';

module.exports = function(grunt) {
  grunt.registerTask('build', 'Build the theme', [
    'compass:dev'
  ]);
};
