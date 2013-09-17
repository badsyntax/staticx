'use strict';

module.exports = function() {
  return {
    jshint: require('./jshint'),
    jasmine_node: require('./jasmine')
  };
};
