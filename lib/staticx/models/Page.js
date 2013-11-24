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
var _ = require('lodash');
var validator = require('../validator');
var BaseModel = require('./Base');
var templateCompiler = require('../compilers/template');
var markdownCompiler = require('../compilers/markdown');

/**
 * Page model.
 * @param  {object} data The page data.
 */
var PageModel = module.exports = function(data) {

  this.setSchema(PageModel.schema);

  this.schema.parent.conform = function(parent) {
    return validator.parentPageExists(parent, this.destination, this.fileExtension);
  }.bind(this);

  this.__defineGetter__('slug', this.getSlug.bind(this));
  this.__defineGetter__('url', this.getUrl.bind(this));
  this.__defineGetter__('metadata', this.getFormattedMetadata.bind(this));

  if (!data || data['filePath'] === undefined)
    this.__defineGetter__('filePath', this.getFilePath.bind(this));

  if (!data || data['fileName'] === undefined)
    this.__defineGetter__('fileName', this.getFileName.bind(this));

  BaseModel.apply(this, arguments);
};

util.inherits(PageModel, BaseModel);

PageModel.schema = {
  date: {
    type: 'string',
    required: true,
    format: 'date-time',
  },
  title: {
    type: 'string',
    required: true
  },
  slug: {
    type: 'string',
    required: false
  },
  url: {
    type: 'string',
    required: false
  },
  destination: {
    type: 'string',
    message: 'Destination path does not exist',
    required: true,
    default: '.',
    conform: validator.fileExists
  },
  parent: {
    type: 'string',
    required: false,
    default: '',
    message: 'Parent page does not exist',
    conform: validator.parentPageExists
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
  },
  markdown: {
    type: 'string',
    required: false,
    default: ''
  }
};

/**
 * Generate the page file path.
 */
PageModel.prototype.getFilePath = function() {

  if (!this.destination)
    throw new Error('destination is not set, unable to generate page model filepath.');

  return path.join(this.destination, '_pages', this.parent || '', this.fileName);
};

/**
 * Generate the page file name.
 */
PageModel.prototype.getFileName = function() {
  return [ this.slug, this.fileExtension ].join('.');
};

/**
 * Generate the page URL.
 */
PageModel.prototype.getUrl = function() {

  var helpers = {
    year: function() {
      return globalize.format(new Date(this.date), 'yyyy');
    }.bind(this),
    month: function() {
      return globalize.format(new Date(this.date), 'MM');
    }.bind(this),
    day: function() {
      return globalize.format(new Date(this.date), 'dd');
    }.bind(this)
  };

  var format = this.config.site.urlFormat || ':slug.:urlExtension';

  return format.replace(/:([a-z]+)/ig, function(match, val) {
    if (helpers[val]) return helpers[val]();
    else return this.getData(val);
  }.bind(this));
};

/**
 * Generate the page slug.
 */
PageModel.prototype.getSlug = function() {
  return getSlug(this.title);
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

  // Ensure the model data is valid.
  var validate = this.validate();
  if (!validate.valid)
    return done(
      util.format('Error saving the page. %s: %s',
        validate.errors[0].property,
        validate.errors[0].message
      )
    );

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

PageModel.prototype.compileTemplate = function(viewPath, done) {
  templateCompiler.compilePath(viewPath, this, done);
};

PageModel.prototype.compileContent = function(done) {
  markdownCompiler.compile(this.markdown, function(err, content) {
    this.content = content;
    done(err, content);
  }.bind(this));
};
