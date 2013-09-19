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
 */
scaffold.createPages = function(dest, days, done) {
  var arr = [];
  while(days--) {
    arr.push(this.createPage.bind(this, dest, days));
  }
  async.parallel(arr, done);
};

/**
 * Create an example page with dummy data.
 * @param  {String}   dest Destination directory.
 * @param  {Number}   days The amount of days in the past from today.
 * @param  {Function} done Callback function.
 */
scaffold.createPage = function(dest, days, done) {
  new ScaffoldPage(dest, days).save(done);
};

