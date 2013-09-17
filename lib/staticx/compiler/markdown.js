'use strict';

var path = require('path');
var fs = require('fs');
var marked = require('marked');
var Compiler = require('../compiler');

/**
 * The Markdown compiler.
 * @constructor
 * @extends Compiler
 */
var Markdown = module.exports = function(options) {
  Compiler.call(this, Markdown.defaultOptions, options);
};

Markdown.prototype = Object.create(Compiler.prototype, {
  constructor: {
    value: Markdown,
    enumerable: false
  }
});

/**
 * Default markdown compiler options.
 */
Markdown.defaultOptions = {
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: true,
  smartLists: true,
  smartypants: false,
  langPrefix: 'lang-'
};

/**
 * Compiles from text.
 * @method
 */
Markdown.prototype.compile = function(data, done) {
  marked(data, this.options, done);
};

/**
 * Compiles from a file path.
 * @method
 */
Markdown.prototype.compilePath = function(filePath, done) {
  fs.readFile(path.resolve(filePath), function (err, contents) {
    if (err) throw err;
    this.compile(contents.toString(), done);
  }.bind(this));
};
