/*
 * staticx
 * https://github.com/badsyntax/staticx
 *
 * Copyright (c) 2013 Richard Willis
 * Licensed under the MIT license.
 */

'use strict';

var fs = require('fs');
var marked = require('marked');

/**
 * The Markdown compiler.
 */
var markdown = module.exports = {};

/**
 * Default markdown compiler options.
 */
markdown.defaultOptions = {
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
markdown.compile = function(data, done) {
  marked(data, markdown.defaultOptions, done);
};

/**
 * Compiles from a file path.
 * @method
 */
markdown.compilePath = function(filePath, done) {
  fs.readFile(filePath, function (err, contents) {
    if (err) return done(err);
    this.compile(contents.toString(), done);
  }.bind(this));
};
