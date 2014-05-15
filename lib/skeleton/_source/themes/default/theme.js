'use strict';

var fs = require('fs');
var path = require('path');
var grunt = require('grunt');
var bower = require('bower');
var async = require('async');

var EventEmitter = require("events").EventEmitter;

var events = exports.events = new EventEmitter();

function bowerInstall(cwd, done) {

  events.emit('bower.install');

  // This is a hack to ensure the .bowerrc file is loaded.
  // See: https://github.com/bower/bower/issues/1301
  var config = JSON.parse(
    fs.readFileSync(path.resolve(cwd, '.bowerrc'), 'utf8')
  );
  config.cwd = cwd;

  bower.commands.install([], {}, config)
  .on('log', function(result) {
    grunt.log.writeln(['bower', result.id.cyan, result.message].join(' '));
  })
  .on('end', function(results) {
    done(null);
  })
  .on('error', function(err) {
    done(err);
  });
}

function runGrunt(cwd, done) {

  events.emit('grunt.run');

  grunt.util.spawn({
    cmd: 'grunt',
    opts: { cwd: cwd }
  }, function(err, result, code) {
    done(err ? result.stdout : null);
  });
}

function buildTheme(options, config, pages, done) {

  var cwd = path.dirname(fs.realpathSync(__filename));

  async.waterfall([
    bowerInstall.bind(null, cwd),
    runGrunt.bind(null, cwd)
  ], done);
}

module.exports = {
  pkg: require('./package.json'),
  build: buildTheme
};


module.exports.build.on = events.on.bind(events);
