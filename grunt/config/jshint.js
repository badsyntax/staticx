'use strict';

module.exports = {
  options: {
    jshintrc: '.jshintrc'
  },
  files: [
    '*.js',
    '*.json',
    'grunt/**/*.js',
    'lib/**/*.js',
    '!**/_source/themes/**',
    'spec/**/*.js',
    'bin/*'
  ],
};
