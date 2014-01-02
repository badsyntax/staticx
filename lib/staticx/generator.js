/*
 * staticx
 * https://github.com/badsyntax/staticx
 *
 * Copyright (c) 2013 Richard Willis
 * Licensed under the MIT license.
 */

'use strict';

var path = require('path');
var async = require('async');
var _ = require('lodash');
var pagesReader = require('../../lib/staticx/readers/pages');
var siteReader = require('../../lib/staticx/readers/site');
var ViewModel = require('../../lib/staticx/ViewModel');

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
  pagesReader.read(options.source, next);
}

/**
 * Build the theme once all pages have been processed.
 * @param  {Array}   pages The array of all page models.
 * @param  {Function} next  Callback function.
 */
function buildTheme(options, config, pages, next) {

  var modulePath = path.resolve(path.join(options.source, '_source', 'themes', config.theme));
  var theme = require(modulePath);

  if (_.isFunction(theme.build)) {
    theme.build(options, config, pages, function(err) {
      next(err, pages);
    });
  } else {
    next(null, pages);
  }
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
    readPages.bind(null, options),
    processPages,
    buildTheme.bind(null, options, config)
  ], done);
};
