'use strict';

var fs = require('fs');
var path = require('path');
var grunt = require('grunt');

module.exports = {
  pkg: require('./package.json'),
  build: function(options, config, pages, done) {

    var cwd = path.dirname(fs.realpathSync(__filename));

    grunt.util.spawn({
      cmd: 'grunt',
      opts: { cwd: cwd }
    }, done);
  }
};
