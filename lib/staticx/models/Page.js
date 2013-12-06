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
var PageModel = module.exports = function(data, config) {

  this.setSchema(PageModel.schema);
  this.setConfig(config);
  this.setData(data);
  this.setGetters();

  // TODO. we should change the validator so that we can access other data
  // within the validator method.
  this.schema.parent.conform = function(parent) {
    return validator.parentPageExists(parent, this.destination, this.fileExtension);
  }.bind(this);

  BaseModel.call(this);
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
  generatedFilePath: {
    type: 'string',
    required: false,
    default: ''
  },
  filePath: {
    type: 'string',
    required: true
  },
  fileExtension: {
    type: 'string',
    required: false,
    default: 'md'
  },
  urlExtension: {
    type: 'string',
    required: false,
    default: 'html'
  },
  markdown: {
    type: 'string',
    required: false,
    default: ''
  }
};

PageModel.prototype.setData = function(data) {
  if (!data) return;
  BaseModel.prototype.setData.call(this, _.extend({
    layoutView: 'layout',
    pageView: 'page',
    fileName: data.filePath ? path.basename(data.filePath) : data.fileName
  }, data || {}));
};

PageModel.prototype.setGetters = function() {
  this.defineGetter('slug', this.getSlug.bind(this));
  this.defineGetter('url', this.getUrl.bind(this));
  this.defineGetter('metadata', this.getMetadata.bind(this));
  this.defineGetter('fileName', this.getFileName.bind(this));
  this.defineGetter('filePath', this.getFilePath.bind(this));
};

PageModel.prototype.defineGetter = function(property, method, data) {
  /* Set the getters only if the properties don't already exist. */
  if (this[property] === undefined || this[property] === null) {
    Object.defineProperty(this, property, { get: method });
  }
};

/**
 * Generate the page file path (eg, path/to/parent/page.md)
 */
PageModel.prototype.getFilePath = function() {
  return path.join(this.destination, this.parent || '', this.fileName);
};

/**
 * Generate the base page file name (eg, page.md)
 */
PageModel.prototype.getFileName = function() {
  return this.getId(this.config.site.fileNameFormat || ':slug.:fileExtension');
};

/**
 * Generate the page URL (eg, parent/page.html)
 */
PageModel.prototype.getUrl = function() {
  var url = [];
  if (this.parent) {
    url.push(this.parent);
  }
  url.push(this.fileName.replace(
    new RegExp(this.fileExtension + '$'),
    this.urlExtension
  ));
  return url.join('/');
};

/**
 * Generate the page ID that will be used for the url and filePath.
 */
PageModel.prototype.getId = function(format) {

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
PageModel.prototype.getFileContent = function(done) {
  this.compileContent(function onCompileContent(content) {
    done([ this.metadata, this.content ].join('\n'));
  }.bind(this));
};

/**
 * Returns the metadata section of the file content.
 * @return {string}
 */
PageModel.prototype.getMetadata = function() {
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
  if (!validate.valid) {
    return done(util.format('Error saving the page. %s: %s',
      validate.errors[0].property,
      validate.errors[0].message
    ));
  }

  this.getFileContent(function(content) {
    BaseModel.prototype.save.call(this, content, done);
  }.bind(this));
};

PageModel.prototype.compileTemplate = function(viewPath, done) {
  templateCompiler.compilePath(viewPath, this, done);
};

PageModel.prototype.compileContent = function(done) {
  markdownCompiler.compile(this.markdown, done);
};
