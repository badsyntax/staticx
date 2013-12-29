/*
 * staticx
 * https://github.com/badsyntax/staticx
 *
 * Copyright (c) 2013 Richard Willis
 * Licensed under the MIT license.
 */

'use strict';

var async = require('async');
var _ = require('lodash');
var pagesReader = require('../../lib/staticx/readers/pages');
var siteReader = require('../../lib/staticx/readers/site');
var ViewModel = require('../../lib/staticx/ViewModel');

/*
 * Process the page: compile the page to markup and save to file.
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
 * Generate a site.
 * @param  {Object}   options Generate options.
 * @param  {Function} done    Callback function.
 */
exports.generate = function(options, done) {

  options = _.merge({ source: '' }, options);

  // Set global data. @FIXME
  ViewModel.config = siteReader.getConfig(options.source);

  function readPages(next) {
    pagesReader.read(options.source, next);
  }

  function processPages(pages, next) {
    async.parallel(pages.map(function(page) {
      return processPage.bind(null, page, pages);
    }), next);
  }

  function buildTheme(pages, next) {
    console.log('NOW BUILD THE SITE RUN NPM, BOWER AND GRUNT')
    console.log('OPTIONS', options);
    console.log('PAGES LENGTH', pages.length);
    next();
  }

  async.waterfall([
    readPages,
    processPages,
    buildTheme
  ], done);
};
