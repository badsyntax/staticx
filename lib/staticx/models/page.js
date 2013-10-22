/*
 * staticx
 * https://github.com/badsyntax/staticx
 *
 * Copyright (c) 2013 Richard Willis
 * Licensed under the MIT license.
 */

'use strict';

/**
 * Load dependencies.
 */
var path = require('path');
var fs = require('fs');
var getSlug = require('speakingurl');
var BaseModel = require('./base');
var Globalize = require('globalize');

/**
 * Page model.
 * @param  {object} data The page data.
 */
var PageModel = module.exports = function(data) {

  this.setSchema({
    date: {
      type: Date,
      required: false,
    },
    dateString: {
      type: String,
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
    urlExtension: {
      type: String,
      required: false,
      default: 'html'
    },
    fileExtension: {
      type: String,
      required: false,
      default: 'md'
    }
  });

  BaseModel.apply(this, arguments);
};

require('util').inherits(PageModel, BaseModel);

/**
 * Generate and set the default data when setting any data on this model.
 */
PageModel.prototype.setData = function() {
  BaseModel.prototype.setData.apply(this, arguments);
  this.setDate();
  this.setSlug();
  this.setUrl();
  this.setFilePath();
};

/**
 * Generate the and set the page file path.
 */
PageModel.prototype.setFilePath = function() {
  var fileName = this.slug + '.' + this.fileExtension;
  this.filePath = path.join(this.filePath, fileName);
};

/**
 * Generate and set the page URL.
 */
PageModel.prototype.setUrl = function() {
  this.url = this.slug + '.' + this.urlExtension;
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
  this.date = Globalize.parseDate(this.dateString);
};

/*
 * Save page to file.
 * @param  {Function} done Callback function.
 */
PageModel.prototype.save = function(done) {
  fs.writeFile(this.filePath, this.content, done);
};

/**
 * Delete page from filesystem.
 * @param  {Function} done Callback function.
 */
PageModel.prototype.delete = function(done) {
  fs.unlink(this.filePath, done);
};
