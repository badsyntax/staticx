'use strict';

var path = require('path');
var fs = require('fs-extra');
var async = require('async');
var ScaffoldPage = require('./scaffold/page');

/**
 * scaffold module.
 */
var scaffold = module.exports = {};

/**
 * Copy a directory
 * @param  {String}   source The source directory.
 * @param  {String}   dest   The destination directory.
 * @param  {Function} done   Callback function.
 */
scaffold.copy = function(source, dest, done) {
  fs.copy(source, dest, function (err) {
    if (err) return done(err);
    done();
  });
};

/**
 * Remove a directory.
 * @param  {String}   source The source directory.
 * @param  {Function} done   Callback function.
 */
scaffold.remove = function(source, done) {
  fs.remove(path.resolve(source), function(err) {
    if (err) return done(err);
    done();
  });
};

/**
 * Create example pages with dummy data.
 * @param  {String}   dest Destination directory.
 * @param  {Number}   days The amount of pages to generate.
 * @param  {Function} done Callback function.
 * @return {Array}    The array of created pages.
 */
scaffold.createPages = function(dest, days, done) {

  var pages = [];
  while(days--) {
    pages.push(
      new ScaffoldPage(dest, days)
    );
  }

  async.parallel(pages.map(function(page) {
    return page.saveFile.bind(page);
  }), function(err) {
    done(err, pages);
  });
};

/**
 * Removes created pages.
 * @param  {Array} pages An array of ScaffoldPage objects.
 * @param {Function} done The callback function.
 */
scaffold.removePages = function(pages, done) {
  async.parallel(pages.map(function(page) {
    return page.removeFile.bind(page);
  }), done);
};
