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

  data = _.extend({
    layoutView: 'layout',
    pageView: 'page',
    fileName: data.filePath ? path.basename(data.filePath) : data.fileName
  }, data || {});

  this.setSchema(PageModel.schema);
  this.setData(data);
  this.setGetters();

  BaseModel.call(this, null, config);
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
    dependencies: ['destination','fileExtension'],
    message: 'Parent page does not exist',
    conform: validator.parentPageExists
  },
  content: {
    type: 'string',
    required: false,
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
  },
  children: {
    type: 'array',
    required: false,
    default: []
  }
};

/**
 * Set property getters.
 */
PageModel.prototype.setGetters = function() {
  this.defineGetter('slug', this.getSlug.bind(this));
  this.defineGetter('url', this.getUrl.bind(this));
  this.defineGetter('metadata', this.getMetadata.bind(this));
  this.defineGetter('fileName', this.getFileName.bind(this));
  this.defineGetter('filePath', this.getFilePath.bind(this));
  this.defineGetter('name', this.getName.bind(this));
};

/**
 * Define a getter property, only if the property has no value.
 * @param  {String} property    The property name.
 * @param  {Function} method    The getter function.
 */
PageModel.prototype.defineGetter = function(property, method, override) {
  /* Set the getters only if the properties don't already exist. */
  if (override || this[property] === undefined || this[property] === null) {
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

PageModel.prototype.getName = function() {
  return this.fileName.replace(new RegExp('.'+this.fileExtension+'$'), '');
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

PageModel.prototype.compileContent = function(done) {
  markdownCompiler.compile(this.markdown, function(err, content) {
    if (err) return done(err);
    this.content = content;
    done();
  }.bind(this));
};
