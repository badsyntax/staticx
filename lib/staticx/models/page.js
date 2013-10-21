/*
 * staticx
 * https://github.com/badsyntax/staticx
 *
 * Copyright (c) 2013 Richard Willis
 * Licensed under the MIT license.
 */

'use strict';

var path = require('path');
var getSlug = require('speakingurl');
var BaseModel = require('./base');
var Globalize = require('globalize');

/**
 * Page model.
 * @param  {String} dest Desination directory.
 * @param  {Number} days The amount of days in the past from today. Used for
 * generating the page date.
 * @return {Object}      The page data.
 */
var PageModel = module.exports = function(data) {

  this.setSchema({
    date: {
      type: Date,
      required: false,
    },
    title: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: false
    },
    content: {
      type: String,
      required: true
    },
    tags: {
      type: String,
      required: false
    },
    extension: {
      type: String,
      required: false
    },
    srcExtension: {
      type: String,
      required: false
    }
  });

  BaseModel.apply(this, arguments);

  this.setDate();
  this.setSlug();
  this.setUrl();
};

require('util').inherits(PageModel, BaseModel);

/**
 * Generate the page file path from the date and title.
 * @return {String}           The full file path.
 */
PageModel.prototype.getFilePath = function() {
  var fileName = this.slug + '.' + this.srcExtension;
  return path.join(this.dest, fileName);
};

/**
 * Generate and set the page URL.
 */
PageModel.prototype.setUrl = function() {
  this.url = this.slug + '.' + this.extension;
};

/**
 * Generate and set the page slug.
 */
PageModel.prototype.setSlug = function() {
  this.slug = [
    Globalize.format(this.date, 'yyyy-MM-dd'),
    getSlug(this.title)
  ].join('-');
};

/**
 * Generate and set the page date.
 */
PageModel.prototype.setDate = function() {
  this.date = Globalize.parseDate(this.date || Globalize.format(new Date(), 'd')) || this.date;
};
