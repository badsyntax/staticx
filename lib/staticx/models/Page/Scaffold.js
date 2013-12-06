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
  this.defineGetter('title', this.getTitle.bind(this));
  this.defineGetter('content', this.getContent.bind(this));
  PageModel.prototype.setGetters.call(this);
};

/**
 * Generates unformatted paragraphs of lipsum.
 * @param {Number} paragraph The amount of paragraphs to generate.
 * @return {String} A string of paragraphs of lorem ipsum.
 */
ScaffoldPageModel.prototype.getContent = function(paragraphs) {
  return dimsum(paragraphs || 3);
};

/**
 * Generate page title from the date.
 * @return {String}      The page title.
 */
ScaffoldPageModel.prototype.getTitle = function() {
  return 'Blog page for ' + dateFormat(this.date, 'dddd, mmmm dS, yyyy');
};
