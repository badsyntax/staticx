/*
 * staticx
 * https://github.com/badsyntax/staticx
 *
 * Copyright (c) 2013 Richard Willis
 * Licensed under the MIT license.
 */

'use strict';

var _ = require('lodash');
var dateFormat = require('dateformat');
var dimsum = require('dimsum');
var PageModel = require('../Page');

/**
 * A scaffold page model.
 * @param  {Object} data The page model data.
 */
var ScaffoldPageModel = module.exports = function(data, config) {
  if (config && config.urlFormat) {
    config.fileNameFormat = config.urlFormat;
  }
  PageModel.call(this, _.extend({
    date: new Date()
  }, data), config);
};

require('util').inherits(ScaffoldPageModel, PageModel);

/**
 * Set property getters.
 */
ScaffoldPageModel.prototype.setGetters = function() {
  this.defineGetter('title', this.getTitle.bind(this), true);
  this.defineGetter('markdown', this.getMarkdown.bind(this), true);
  PageModel.prototype.setGetters.call(this);
};

/**
 * Returns the file content. (For a scaffold page, we'll be saving the markdown
 * and /not/ the compiled content.)
 * @param  {Function} done Callback function.
 */
PageModel.prototype.getFileContent = function(done) {
  done([ this.metadata, this.markdown ].join('\n'));
};

/**
 * Generates unformatted paragraphs of lipsum.
 * @param {Number} paragraph The amount of paragraphs to generate.
 * @return {String} A string of paragraphs of lorem ipsum.
 */
ScaffoldPageModel.prototype.getMarkdown = function(paragraphs) {
  return dimsum(paragraphs || 3);
};

/**
 * Generate page title from the date.
 * @return {String}      The page title.
 */
ScaffoldPageModel.prototype.getTitle = function() {
  return 'Blog page for ' + dateFormat(this.date, 'dddd, mmmm dS, yyyy');
};
