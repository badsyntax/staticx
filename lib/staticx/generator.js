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
var fs = require('fs-extra');
var _ = require('lodash');

var templateCompiler = require('../../lib/staticx/compilers/template');
var pagesReader = require('../../lib/staticx/readers/pages');

var generator = module.exports = {};

generator.generate = (function(options, done) {

  var viewsPath;
  var layoutView;
  var pageView;

  function makeParentDirs(options, next) {
    if (options.makeParentDirs) {
      fs.mkdirs(options.destination, next);
    } else {
      next(null);
    }
  }

  function checkPathsExist(options, next) {
    async.forEach([
      options.source,
      options.destination
    ], function(dir, callback) {
      fs.exists(dir, function(exists) {
        if (!exists) callback('Not found');
        else callback(null);
      });
    }, next);
  }

  function onCompileLayoutView(page, next, err, layout) {
    if (err) return next(err);

    var dirs = path.dirname(page.filePath).split(path.sep);
    var filePath = path.join.apply(path, dirs.slice(dirs.indexOf('_pages') + 1));
    var baseName = path.basename(page.fileName);

    filePath = path.join(
      options.destination,
      filePath,
      baseName.substr(0, baseName.lastIndexOf('.')) + '.html'
    );

    fs.outputFile(filePath, layout, next);
  }

  function onCompilePageTemplate(page, next, err, template) {
    if (err) return next(err);
    templateCompiler.compilePath(layoutView, {
      body: template,
      page: page,
      viewPath: layoutView
    }, onCompileLayoutView.bind(null, page, next));
  }

  function onCompilePageContent(page, next, err, content) {
    if (err) return next(err);
    page.compileTemplate(pageView, onCompilePageTemplate.bind(null, page, next));
  }

  function processPage(page, next) {
    page.compileContent(onCompilePageContent.bind(null, page, next));
  }

  function processPages(err, pages) {
    if (err) return done(err);
    async.parallel(pages.map(function(page) {
      return processPage.bind(null, page);
    }), function(err) {
      done(err, pages);
    });
  }

  return function init(opt, next) {

    done = next;

    options = _.merge({
      source: '',
      destination: '',
      makeParentDirs: false
    }, opt);

    viewsPath  = path.join(options.source, 'views');
    layoutView = path.join(viewsPath, 'layout.html');
    pageView   = path.join(viewsPath, 'page.html');

    async.series([
      makeParentDirs.bind(null, options),
      checkPathsExist.bind(null, options)
    ], function(err) {
      if (err) return done(err);
      pagesReader.read(options.source, processPages);
    });
  };
}());
