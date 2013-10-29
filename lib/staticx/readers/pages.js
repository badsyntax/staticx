/*
 * staticx
 * https://github.com/badsyntax/staticx
 *
 * Copyright (c) 2013 Richard Willis
 * Licensed under the MIT license.
 */

'use strict';

var glob = require('glob');
var fs = require('fs');
var path = require('path');
var async = require('async');
var _ = require('lodash');
var markdownParser = require('../parsers/markdown');
var markdownCompiler = require('../compilers/markdown');
var PageModel = require('../models/page');

/**
 * The Pages reader.
 *
 */
var pages = module.exports = {};

function onMarkdownCompile(obj, file, done, err, content) {
  if (err) throw err;
  var model = new PageModel(_.merge({}, {
    filePath: file,
    content: content
  }, obj.metadata));
  done(null, model);
}

function parseMarkdownFile(dir, file, done) {
  file = path.join(dir, file);
  markdownParser.parseFile(file, function(err, obj) {
    if (err) throw err;
    markdownCompiler.compile(obj.markdown, onMarkdownCompile.bind(null, obj, file, done));
  });
}

function parseMarkdownFiles(dir, done, err, files) {
  if (err) throw err;
  async.map(files, parseMarkdownFile.bind(null, dir), function(err, data) {
    if (err) throw err;
    done(null, data);
  });
}

pages.read = function(dir, done) {
  fs.exists(dir, function(exists) {
    if (!exists) return done('Source directory does not exist: ' + dir);
    var globOpts = { cwd: path.resolve(dir) };
    glob("**/*.md", globOpts, parseMarkdownFiles.bind(null, dir, done));
  });
};
