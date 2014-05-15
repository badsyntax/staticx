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
var pagesReader = require('../../lib/staticx/readers/pages');
var siteReader = require('../../lib/staticx/readers/site');
var ViewModel = require('../../lib/staticx/ViewModel');
var npm = require('npm');
var EventEmitter = require("events").EventEmitter;

var events = exports.events = new EventEmitter();

/**
 * Process the page: compile the page to markup and save to file.
 * @param  {PageModel}    page  The page model.
 * @param  {Array}        pages Array containing all page models.
 * @param  {Function}     next  [description]
 */
function processPage(page, pages, next) {

  var globalData = {
    page: page,
    pages: pages
  };

  var body = ViewModel.factory(page.pageView, page.destination, globalData);

  var layout = ViewModel.factory(page.layoutView, page.destination, _.extend({
    body: body
  }, globalData));

  layout.save(page.filePath, next);
}

/**
 * Process all pages.
 * @param  {Array}   pages The array of all page models.
 * @param  {Function} next  Callback function.
 */
function processPages(pages, next) {
  events.emit('pages.processing', pages);
  async.parallel(pages.map(function(page) {
    return processPage.bind(null, page, pages);
  }), function done(err) {
    next(err, pages);
  });
}

/**
 * Read all pages on the filestem.
 * @param  {Function} next Callback function.
 */
function readPages(options, next) {
  events.emit('pages.reading');
  pagesReader.read(options.source, next);
}

/**
 * Build the theme once all pages have been processed.
 * @param  {Array}   pages The array of all page models.
 * @param  {Function} next  Callback function.
 */
function buildTheme(options, config, pages, done) {

  var basePath = path.resolve(options.source, '_source', 'themes', config.theme);
  var modulePath = path.resolve(basePath, 'theme');
  var assetsPath = path.resolve(basePath, 'assets');
  var publicAssetsPath = path.resolve(options.source, 'assets');

  var theme = require(modulePath);

  theme.build.on('grunt.run',
    events.emit.bind(events, 'theme.grunt.run'));

  theme.build.on('bower.install',
    events.emit.bind(events, 'theme.installdeps.client'));

  async.waterfall([
    _.isFunction(theme.build) ? function(next) {
      events.emit('theme.build', config.theme);
      theme.build(options, config, pages, next);
    } : null,
    function(next) {
      events.emit('theme.assetscopy');
      fs.removeSync(publicAssetsPath);
      fs.copy(assetsPath, publicAssetsPath, next);
    }
  ], done);
}

function installDeps(options, config, done) {

  var cwd = path.resolve(options.source, '_source', 'themes', config.theme);

  events.emit('theme.installdeps');

  async.waterfall([
    function(next) {
      npm.load({ prefix: cwd }, next);
    },
    function(npm, next) {
      npm.commands.install(cwd, [], next);
    }
  ], function(err) {
    done(err);
  });
}

/**
 * Generate a site.
 * @param  {Object}   options Generate options.
 * @param  {Function} done    Callback function.
 */
exports.generate = function(options, done) {

  options = _.merge({ source: '' }, options);
  var config = siteReader.getConfig(options.source);
  ViewModel.config = config;

  async.waterfall([
    installDeps.bind(null, options, config),
    readPages.bind(null, options),
    processPages,
    buildTheme.bind(null, options, config)
  ], done);
};

exports.generate.on = events.on.bind(events);
