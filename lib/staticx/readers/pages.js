/*
 * staticx
 * https://github.com/badsyntax/staticx
 *
 * Copyright (c) 2013 Richard Willis
 * Licensed under the MIT license.
 */

'use strict';

var glob = require('glob');
var fs = require('graceful-fs');
var path = require('path');
var async = require('async');
var _ = require('lodash');
var markdownParser = require('../parsers/markdown');
var PageModel = require('../models/Page');

/**
 * The Pages reader.
 *
 */
var pages = module.exports = {};

function getParent(file, destination) {

  var parts = file.split(path.sep)
  // Remove '_pages' and '_source' from the file path.
  .filter(function(dir) {
    return (dir !== '_pages' && dir !== '_source');
  })
  .join(path.sep)
  // Remove the destination path from the file path.
  .split(destination).join('')
  .split(path.sep);

  var parent = '';
  if (parts.length > 1) {
    parent = parts[parts.length-2];
  }

  return parent;
}

/**
 * Parses a markdown file into an object literal.
 * @param  {String}   dir  Directory to file.
 * @param  {String}   file The file name.
 * @param  {Function} done Callback function.
 */
function parseMarkdownFile(destination, file, done) {
  markdownParser.parseFile(file, function(err, data) {
    if (err) throw err;
    done(null, new PageModel(_.merge({}, {
      filePath: file,
      fileName: path.basename(file),
      markdown: data.markdown,
      destination: destination,
      parent: getParent(file, destination)
    }, data.metadata)));
  });
}

/**
 * Reads and parses pages on the filesystem.
 * @param  {String}   dir  The directory path to the pages.
 * @param  {Function} done Callback function.
 */
pages.read = function(dir, done) {
  fs.exists(dir, function(exists) {
    if (!exists) return done('Source directory does not exist: ' + dir);
    async.waterfall([
      glob.bind(glob, '_source/_pages/**/*.md', {
        cwd: path.resolve(dir)
      }),
      function parseFiles(files, callback) {
        async.map(files.map(function(file) {
          return path.join(dir, file);
        }), parseMarkdownFile.bind(null, dir), callback);
      },
    ], done);
  });
};
