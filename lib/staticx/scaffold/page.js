/*
 * staticx
 * https://github.com/badsyntax/staticx
 *
 * Copyright (c) 2013 Richard Willis
 * Licensed under the MIT license.
 */

'use strict';

var fs = require('fs');
var path = require('path');
var dateFormat = require('dateformat');
var getSlug = require('speakingurl');
var dimsum = require('dimsum');
var PageModel = require('../models/page');

/**
 * A scaffold page model.
 * @param  {String} dest Desination directory.
 * @param  {Number} days The amount of days in the past from today. Used for
 * generating the page date.
 * @return {Object}      The page data.
 */
var ScaffoldPageModel = module.exports = function(dest, days, now) {
  this.destination = dest;
  this.days = days;
  this.now = now;
  PageModel.call(this);
};

require('util').inherits(ScaffoldPageModel, PageModel);

ScaffoldPageModel.prototype.setData = function() {
  this.setDate();
  this.setTitle();
  this.setContent();
  PageModel.prototype.setData.apply(this, arguments);
};

/**
 * Generates unformatted paragraphs of lipsum.
 * @param {Number} paragraph The amount of paragraphs to generate.
 * @return {String}
 */
ScaffoldPageModel.prototype.setContent = function(paragraphs) {
  this.content = dimsum(paragraphs || 3);
};

/**
 * Generate the page date.
 * @param  {Number} days The amount of days in the past from today.
 * @return {Date}      The page date.
 */
ScaffoldPageModel.prototype.setDate = function(days, now) {
  this.date = this.now || new Date();
  this.date.setDate(this.date.getDate() - (this.days || 0));
};

/**
 * Generate page title from the date.
 * @param  {Date} date The page date.
 * @return {String}      The page title.
 */
ScaffoldPageModel.prototype.setTitle = function() {
  this.title = 'Blog page for ' + dateFormat(this.date, 'dddd, mmmm dS, yyyy');
};
