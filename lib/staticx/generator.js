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

  var layout = ViewModel
  .factory(page.layoutView, page.destination, _.extend({
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

  // Process the source pages.
  pagesReader.read(options.source, function processPages(err, pages) {
    if (err) return done(err);
    async.parallel(pages.map(function(page) {
      return processPage.bind(null, page, pages);
    }), function(err) {
      // Success! Our final callback out of here...
      done(err, pages);
    });
  });
};
