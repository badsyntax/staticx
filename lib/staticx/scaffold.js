'use strict';

var path = require('path');
var fs = require('fs-extra');

/**
 * The scaffold.
 */
var scaffold = module.exports = {};

scaffold.copy = function(source, dest, done) {
  fs.copy(source, dest, function (err) {
    if (err) throw err;
    done();
  });
};

scaffold.remove = function(source, done) {
  fs.remove(path.resolve(source), function(err) {
    if (err) throw err;
    done();
  });
};
