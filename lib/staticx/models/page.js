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
      required: true,
      default: ''
    },
    tags: {
      type: String,
      required: false,
      default: ''
    },
    destination: {
      type: String,
      'fs-exists': true,
      required: true
    },
    filePath: {
      type: String,
      required: true
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

  this.__defineGetter__('slug', this.getSlug.bind(this));
  this.__defineGetter__('url', this.getUrl.bind(this));
  this.__defineGetter__('filePath', this.getFilePath.bind(this));
};

util.inherits(PageModel, BaseModel);

/**
 * Generate the page file path.
 */
PageModel.prototype.getFilePath = function() {
  if (!this.destination) throw new Error('destination is not set, unable to generate page model filepath.');
  var fileName = this.slug + '.' + this.fileExtension;
  return path.join(this.destination, fileName);
};

/**
 * Generate the page URL.
 */
PageModel.prototype.getUrl = function() {
  return this.slug + '.' + this.urlExtension;
};

/**
 * Generate the page slug.
 */
PageModel.prototype.getSlug = function() {
  return [
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
  fs.writeFile(this.filePath, this.getFileContent(), function(err) {
    done(err, this);
  }.bind(this));
};

/**
 * Delete page from filesystem.
 * @param  {Function} done Callback function.
 */
PageModel.prototype.delete = function(done) {
  fs.unlink(this.filePath, done);
};
