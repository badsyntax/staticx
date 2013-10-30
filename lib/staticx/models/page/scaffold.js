/*
 * staticx
 * https://github.com/badsyntax/staticx
 *
 * Copyright (c) 2013 Richard Willis
 * Licensed under the MIT license.
 */

'use strict';

var dateFormat = require('dateformat');
var dimsum = require('dimsum');
var PageModel = require('../page');
var BaseModel = require('../base');

/**
 * A scaffold page model.
 * @param  {String} dest Desination directory.
 * @param  {Number} days The amount of days in the past from today. Used for
 * generating the page date.
 * @return {Object}      The page data.
 */
var ScaffoldPageModel = module.exports = function(data) {
  PageModel.apply(this, arguments);
  this.__defineGetter__('title', this.getTitle.bind(this));
  this.__defineGetter__('content', this.getContent.bind(this));
  this.date = this.date || new Date();
};

require('util').inherits(ScaffoldPageModel, PageModel);

/**
 * Generates unformatted paragraphs of lipsum.
 * @param {Number} paragraph The amount of paragraphs to generate.
 * @return {String}
 */
ScaffoldPageModel.prototype.getContent = function(paragraphs) {
  return dimsum(paragraphs || 3);
};

/**
 * Generate page title from the date.
 * @param  {Date} date The page date.
 * @return {String}      The page title.
 */
ScaffoldPageModel.prototype.getTitle = function() {
  return 'Blog page for ' + dateFormat(this.date, 'dddd, mmmm dS, yyyy');
};
