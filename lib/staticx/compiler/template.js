'use strict';

var path = require('path');
var fs = require('fs');
var handlebars = require('handlebars');
var Compiler = require('../compiler');

/**
 * The template compiler.
 * @constructor
 * @extends Compiler
 */
var Template = module.exports = function(options) {
  Compiler.call(this, Template.defaultOptions, options);
};

Template.prototype = Object.create(Compiler.prototype, {
  constructor: {
    value: Template,
    enumerable: false
  }
});

/**
 * Default template compiler options.
 */
Template.defaultOptions = {};

/**
 * Compiles from text.
 * @method
 */
Template.prototype.compile = function(template, data, done) {
  template = handlebars.compile(template);
  done(null, template(data));
};

/**
 * Compiles from a file path.
 * @method
 */
Template.prototype.compilePath = function(filePath, data, done) {
  fs.readFile(path.resolve(filePath), function (err, contents) {
    if (err) throw err;
    this.compile(contents.toString(), data, done);
  }.bind(this));
};
