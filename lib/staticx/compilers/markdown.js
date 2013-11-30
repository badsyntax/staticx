/*
 * staticx
 * https://github.com/badsyntax/staticx
 *
 * Copyright (c) 2013 Richard Willis
 * Licensed under the MIT license.
 */

'use strict';

var fs = require('graceful-fs');
var marked = require('marked');

/**
 * The Markdown compiler.
 */
var markdown = module.exports = {};
var cache = { paths: {} };

/**
 * Default markdown compiler options.
 */
markdown.options = {
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
 * @param {String}    data The markdown text.
 * @param {Function}  done Callback function.
 */
markdown.compile = function(data, done) {
  marked(data, markdown.options, done);
};

/**
 * Compiles from a file path.
 * @param {String}    filePath  Path to the markdown file.
 * @param {Function}  done      Callback function.
 */
markdown.compilePath = function(filePath, done) {
  var compile = function compile() {
    this.compile(cache.paths[filePath], done);
  }.bind(this);
  if (!cache.paths[filePath]) {
    fs.readFile(filePath, function (err, contents) {
      if (err) return done(err);
      cache.paths[filePath] = contents.toString();
      compile();
    });
  } else compile();
};
