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

var templateCompiler = require('../../lib/staticx/compilers/template');
var pagesReader = require('../../lib/staticx/readers/pages');
var siteReader = require('../../lib/staticx/readers/site');

var generator = module.exports = {};

/**
 * Generate a site.
 * @param  {Object}   options Generate options.
 * @param  {Function} done    Callback function.
 */
generator.generate = (function(options, done) {

  // Global vars.
  var viewsPath;
  var layoutView;
  var pageView;
  var config;

  /**
   * THIS SHOULD ALL BE MOVED INTO THE MODEL
   */

  /*
   * Save the entire page markup to file.
   */
  function savePageToFile(page, next, err, layoutHtml) {

    var baseName = path.basename(page.fileName);
    var dirs = path.dirname(page.filePath).split(path.sep);

    // Filter out the '_pages' and '_source' directories.
    var filePath = dirs.filter(function(dir) {
      return (dir !== '_pages' && dir !== '_source');
    });

    // Change the file extension.
    filePath.push(baseName.substr(0, baseName.lastIndexOf('.')) + '.' + (config.urlExtension || 'html'));
    page.generatedFilePath = path.join.apply(path, filePath);

    fs.outputFile(page.generatedFilePath, layoutHtml, function(err) {
      if (err) return next(err);
      next(null, page);
    });
  }

  /*
   * Compile the layout template success handler.
   */
  function onCompileLayoutTemplate(page, next, err, layout) {
    if (err) return next(err);
    savePageToFile(page, next, err, layout);
  }

  /*
   * Compile the layout template.
   */
  function compileLayoutTemplate(page, pages, next, err, template) {
    templateCompiler.compilePath(layoutView, {
      body: template,
      page: page,
      pages: pages,
      viewPath: layoutView
    }, onCompileLayoutTemplate.bind(null, page, next));
  }

  /*
   * Compile the page template success handler.
   */
  function onCompilePageTemplate(page, pages, next, err, template) {
    if (err) return next(err);
    compileLayoutTemplate(page, pages, next, err, template);
  }

  /*
   * Compile the page content success handler.
   */
  function onCompilePageContent(page, pages, next, err, content) {
    if (err) return next(err);
    page.compileTemplate(pageView, onCompilePageTemplate.bind(null, page, pages, next));
  }

  /*
   * Process the page: compile the page to markup and save to file.
   * What do we need to compile the page?
   * * To start, we need a layout view, which is defined in the page model.
   * * For every view, we need to find associated viewmodels.
   * * The viewmodels would render the view.
   * * View partials should also use viewmodels.
   */
  function processPage(page, pages, next) {
    // What w
    page.compileContent(onCompilePageContent.bind(null, page, pages, next));
  }

  /*
   * Process all pages in the source directory.
   */
  function processPages(err, pages) {
    if (err) return done(err);
    async.parallel(pages.map(function(page) {
      return processPage.bind(null, page, pages);
    }), function(err, pages) {
      // Success! Our final callback out of here...
      done(err, pages);
    });
  }

  function init(opt, next) {

    // Set global vars.
    done       = next;
    options    = _.merge({ source: '' }, opt);
    viewsPath  = path.join(options.source, '_source', 'views');
    layoutView = path.join(viewsPath, 'layout.html'); // This should be set within the layout viewmodel.
    pageView   = path.join(viewsPath, 'page.html'); // This should be set within the page viewmodel.
    config     = siteReader.getConfig(options.source);

    // Process the source pages.
    pagesReader.read(options.source, processPages);
  }

  return init;
}());
