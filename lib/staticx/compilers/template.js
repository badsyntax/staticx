'use strict';

var fs = require('fs');
var handlebars = require('handlebars');

/**
 * The template compiler.
 * @constructor
 * @extends Compiler
 */
var template = module.exports = {};

/**
 * Compiles from text.
 * @method
 */
template.compile = function(template, data, done) {
  template = handlebars.compile(template);
  done(null, template(data));
};

/**
 * Compiles from a file path.
 * @method
 */
template.compilePath = function(filePath, data, done) {
  fs.readFile(filePath, function (err, contents) {
    if (err) throw err;
    this.compile(contents.toString(), data, done);
  }.bind(this));
};
