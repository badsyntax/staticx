/*
 * staticx
 * https://github.com/badsyntax/staticx
 *
 * Copyright (c) 2013 Richard Willis
 * Licensed under the MIT license.
 */

'use strict';

var path = require('path');
var fs = require('fs-extra');
var async = require('async');
var _ = require('lodash');
var staticx = require('../staticx');

/**
 * scaffold module.
 */
var scaffold = module.exports = {};
scaffold.Page = require('./scaffold/page');

/**
 * Copy the contents of a source directory to a destination directory.
 * @param  {String}   source The source directory.
 * @param  {String}   dest   The destination directory.
 * @param  {Function} done   Callback function.
 */
scaffold.copy = function(source, dest, done) {
  async.forEach([source, dest], function(path, callback) {
    fs.exists(path, function(exists) {
      if (!exists) return done('Source and destination path must exist.');
      callback();
    });
  }, fs.copy.bind(fs, source, dest, done));
};

/**
 * Create a new site (with optional dummy posts) from skeleton files.
 * @param  {Object}   options The options.
 * @param  {Function} done    Callback function.
 */
scaffold.create = function(options, done) {

  options = _.merge({
    source: '../skeleton',
    destination: '',
    posts: null,
    clean: false
  }, options);

  function createPosts() {
    var dest = path.join(options.destination, '_pages', 'blog');
    scaffold.createPages(dest, options.posts, done);
  }

  function onCopy(err) {

    if (err) return done(err);

    if (options.posts && !isNaN(options.posts)) {
      createPosts();
    } else {
      done();
    }
  }

  function clean(next) {
    scaffold.clean(options.destination, function(err) {
      if (err) return done(err);
      next();
    });
  }

  function copy() {
    scaffold.copy(options.source, options.destination, onCopy);
  }

  if (options.clean) {
    clean(copy);
  } else {
    copy();
  }
};

scaffold.addPage = function(options, done) {

  var page = new staticx.models.Page(options);
  var validate = page.validate();

  if (validate._error) {
    console.log('VALIDATE ERRORS', validate);
  }
};

/**
 * Remove a directory.
 * @param  {String}   source The source directory.
 * @param  {Function} done   Callback function.
 */
scaffold.remove = function(source, done) {
  fs.exists(source, function(exists) {
    if (!exists) return done('Unable to remove directory, does not exist: ' + source);
    fs.remove(source, done);
  });
};

/**
 * Clean a directory.
 * @param  {String}   source The source directory.
 * @param  {Function} done   Callback function.
 */
scaffold.clean = function(source, done) {
  this.remove(source, function(err) {
    if (err) return done(err);
    fs.mkdir(source, done);
  });
};

/**
 * Create example pages with dummy data.
 * @param   {String}    dest        Destination directory.
 * @param   {Number}    days        The amount of pages to generate.
 * @param   {Function}  done        Callback function.
 * @return  {Array}     The array of created pages.
 */
scaffold.createPages = function(dest, days, done) {

  var pages = [];
  while(days--) {
    pages.push(
      new scaffold.Page(dest, days)
    );
  }

  async.parallel(pages.map(function(page) {
    return page.save.bind(page);
  }), function(err) {
    done(err, pages);
  });
};

/**
 * Removes created pages.
 * @param   {Array}     pages An array of ScaffoldPage objects.
 * @param   {Function}  done  The callback function.
 */
scaffold.removePages = function(pages, done) {
  async.parallel(pages.map(function(page) {
    return page.delete.bind(page);
  }), done);
};
