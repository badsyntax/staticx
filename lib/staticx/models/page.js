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
var fs = require('fs-extra');
var util = require('util');
var getSlug = require('speakingurl');
var globalize = require('globalize');
var validator = require('../validator');
var BaseModel = require('./base');

/**
 * Page model.
 * @param  {object} data The page data.
 */
var PageModel = module.exports = function(data) {

  BaseModel.apply(this, arguments);

  this.setSchema(PageModel.schema);
  this.schema.parent.conform = validator.parentPageExists.bind(this);

  this.__defineGetter__('slug', this.getSlug.bind(this));
  this.__defineGetter__('url', this.getUrl.bind(this));
  this.__defineGetter__('fileName', this.getFileName.bind(this));
  this.__defineGetter__('filePath', this.getFilePath.bind(this));
  this.__defineGetter__('metadata', this.getFormattedMetadata.bind(this));
};

util.inherits(PageModel, BaseModel);

PageModel.schema = {
  date: {
    type: 'string',
    required: false,
    format: 'date-time'
  },
  title: {
    name: 'title',
    type: 'string',
    required: true
  },
  url: {
    type: 'string',
    required: false
  },
  parent: {
    type: 'string',
    required: false,
    default: '',
    message: 'Parent page does not exist',
    conform: validator.parentPageExists,
    name: 'parent',
  },
  content: {
    type: 'string',
    required: true,
    default: ''
  },
  tags: {
    type: 'string',
    required: false,
    default: ''
  },
  destination: {
    type: 'string',
    message: 'Path does not exist',
    conform: validator.fileExists,
    required: true,
    default: '.'
  },
  filePath: {
    type: 'string',
    required: true
  },
  urlExtension: {
    type: 'string',
    required: false,
    default: 'html'
  },
  fileExtension: {
    type: 'string',
    required: false,
    default: 'md'
  }
};

/**
 * Generate the page file path.
 */
PageModel.prototype.getFilePath = function() {
  if (!this.destination) throw new Error('destination is not set, unable to generate page model filepath.');
  return path.join(this.destination, '_pages', this.parent || '', this.fileName);
};

/**
 * Generate the page file name.
 */
PageModel.prototype.getFileName = function() {
  return this.slug + '.' + this.fileExtension;
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
    // globalize.format(this.date, 'yyyy-MM-dd'),
    getSlug(this.title)
  ].join('-');
};

/**
 * Returns the file content.
 * @return {string}
 */
PageModel.prototype.getFileContent = function() {
  return [ this.metadata, this.content ].join('\n');
};

/**
 * Returns the metadata section of the file content.
 * @return {string}
 */
PageModel.prototype.getFormattedMetadata = function() {
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
  // Using fs.outputFile, we ensure the directory exists before writing to file.
  fs.outputFile(this.filePath, this.getFileContent(), function(err) {
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
