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
var util = require('util');
var PageModel = require('./models/Page');
var ScaffoldPageModel = require('./models/Page/Scaffold');

/**
 * scaffold module.
 */
var scaffold = module.exports = {};

/**
 * Copy the contents of a source directory to a destination directory.
 * @param  {String}   source        The source directory.
 * @param  {String}   destination   The destination directory.
 * @param  {Function} done          Callback function.
 */
scaffold.copy = function(source, destination, done) {
  async.parallel([
    function(next) {
      fs.exists(source, function(exists) {
        if (!exists) return next('Scaffold copy: Source path must exist.');
        next();
      });
    },
    function(next) {
      fs.exists(destination, function(exists) {
        if (!exists) return next('Scaffold copy: Destination path must exist.');
        next();
      });
    }
  ], function() {
    fs.copy(source, destination, done);
  });
};

/**
 * Create a new site (with optional dummy posts) from skeleton files.
 * @param  {Object}   options The create options.
 * @param  {Function} done    Callback function.
 */
scaffold.create = (function(options, done) {

  function createPosts() {
    options.destination = path.join(options.destination, '_source', 'pages', 'blog');
    scaffold.createPosts(options, done);
  }

  function clean(next) {
    scaffold.clean(options.destination, function(err) {
      if (err) return done(err);
      next();
    });
  }

  function copy() {
    scaffold.copy(options.source, options.destination, function(err) {
      if (err) return done(err);
      if (options.posts && !isNaN(options.posts)) {
        createPosts();
      } else {
        done();
      }
    });
  }

  function makeParentDirs(options, done) {
    if (options.makeParentDirs) {
      fs.mkdirs(options.destination, done);
    } else {
      done(null);
    }
  }

  function init(opt, next) {

    done = next;

    options = _.merge({
      destination: '',
      source: '',
      makeParentDirs: false
    }, opt);

    if (!options.destination || !options.source) {
      return done('Destination and source directories must be specified.');
    }

    makeParentDirs(options, function(err) {
      if (err) return done(err);
      if (options.clean === true || options.clean === 'y') {
        clean(copy);
      } else {
        copy();
      }
    });
  }

  return init;
}());

/**
 * Create a new page and save it on the filesystem.
 * @param  {Object}   options The options object, which should contain the page data.
 * @param  {Function} done    Callback function.
 */
scaffold.addPage = function(options, done) {
  options.destination = path.join(options.destination, '_source', 'pages');
  new PageModel(options).save(done);
};

/**
 * Remove a directory from the filesystem.
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
 * Clean a directory: remove all files within a directory.
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
 * Create example blog posts with dummy data.
 * @param   {Object}    options The create posts options.
 * @param   {Function}  done    Callback function.
 */
scaffold.createPosts = function(options, done) {

  if (options.posts === undefined) {
    throw new Error('You need to specify how many blog posts to create');
  }

  var pages = [];
  var posts = options.posts;
  while(posts--) {
    var date = new Date();
    date.setDate(date.getDate() - posts);
    pages.push(
      new ScaffoldPageModel(_.merge({}, options, {
        date: date.toISOString()
      }))
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
 * @param   {Array}     pages An array of ScaffoldPageModel objects.
 * @param   {Function}  done  The callback function.
 */
scaffold.removePages = function(pages, done) {
  async.parallel(pages.map(function(page) {
    return page.delete.bind(page);
  }), done);
};
