/*
 * staticx
 * https://github.com/badsyntax/staticx
 *
 * Copyright (c) 2013 Richard Willis
 * Licensed under the MIT license.
 */

'use strict';

var path = require('path');
var util = require('util');
var async = require('async');
var fs = require('fs-extra');
var _ = require('lodash');

var pagesReader = require('../../lib/staticx/readers/pages');
var ViewModel = require('../../lib/staticx/ViewModel');

var generator = module.exports = {};

/**
 * Generate a site.
 * @param  {Object}   options Generate options.
 * @param  {Function} done    Callback function.
 */
generator.generate = (function(options, done) {

  /*
   * Process the page: compile the page to markup and save to file.
   */
  function processPage(page, pages, next) {
    page.compileContent(function onCompilePageContent(err) {
      if (err) throw err;
      var data = {
        page: page,
        pages: pages
      };
      ViewModel.factory(page.layoutView, page.destination, _.extend({
        body: ViewModel.factory(page.pageView, page.destination, data)
      }, data))
      .renderFile(page.fileName, page.filePath, next);
    });
  }

  return function init(options, done) {

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
}());
