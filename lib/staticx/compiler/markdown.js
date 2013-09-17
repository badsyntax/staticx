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
var MarkdownCompiler = module.exports = function(options) {
  Compiler.call(this, MarkdownCompiler.defaultOptions, options);
};

MarkdownCompiler.prototype = Object.create(Compiler.prototype, {
  constructor: {
    value: MarkdownCompiler,
    enumerable: false
  }
});

/**
 * Default markdown compiler options.
 */
MarkdownCompiler.defaultOptions = {
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
MarkdownCompiler.prototype.compile = function(data, done) {
  marked(data, this.options, done);
};

/**
 * Compiles from a file path.
 * @method
 */
MarkdownCompiler.prototype.compilePath = function(filePath, done) {
  fs.readFile(path.resolve(filePath), function (err, contents) {
    if (err) throw err;
    this.compile(contents.toString(), done);
  }.bind(this));
};
