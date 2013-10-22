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
var util = require('util');
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
 * Returns the file content.
 * @return {string}
 */
PageModel.prototype.getFileContent = function() {
  return [
    this.getMetadataFileContent(),
    this.content
  ].join('\n');
};

/**
 * Returns the metadata section of the file content.
 * @return {string}
 */
PageModel.prototype.getMetadataFileContent = function() {
  var metadata = [];
  metadata.push('---');
  if (this.title) metadata.push(util.format('title: %s', this.title));
  if (this.date)  metadata.push(util.format('date: %s', this.date));
  if (this.tags)  metadata.push(util.format('tags: %s', this.tags));
  metadata.push('---');
  return metadata.join('\n');
};

/*
 * Save page to file.
 * @param  {Function} done Callback function.
 */
PageModel.prototype.save = function(done) {
  fs.writeFile(this.filePath, this.getFileContent(), done);
};

/**
 * Delete page from filesystem.
 * @param  {Function} done Callback function.
 */
PageModel.prototype.delete = function(done) {
  fs.unlink(this.filePath, done);
};
