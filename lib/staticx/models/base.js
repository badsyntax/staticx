/*
 * staticx
 * https://github.com/badsyntax/staticx
 *
 * Copyright (c) 2013 Richard Willis
 * Licensed under the MIT license.
 */

'use strict';

var fs = require('fs');
var _ = require('lodash');
var Validator = require('schema-validator');

/**
 * Base model.
 */
var BaseModel = module.exports = function(data) {

  if (!this.schema) {
    throw new Error('Schema not set');
  }
  if (!this.getFilePath) {
    throw new Error('getFilePath() method not implemented');
  }

  this.validator = new Validator(this.schema);
  this.validator.debug = true;

  this.setData(data);
};

BaseModel.prototype.setSchema = function(schema) {
  this.schema = schema;
  _.forEach(this.schema, function(val, key) {
    this[key] = null;
  }.bind(this));
};

/**
 */
BaseModel.prototype.setData = function(data) {
  _.forEach(data, function(val, key) {
    this[key] = val;
  }.bind(this));
};

BaseModel.prototype.getData = function() {
  var data = {};
  _.forEach(this.schema, function(val, key) {
    data[key] = this[key];
  }.bind(this));
  return data;
};

BaseModel.prototype.validate = function(data) {
  return this.validator.check(this.getData());
};

/**
 * Save page to file.
 * @param  {Function} done Callback function.
 */
BaseModel.prototype.save = function(done) {
  fs.writeFile(this.filePath, this.contents, done);
};

/**
 * Remove a page.
 * @param  {Function} done Callback function.
 */
BaseModel.prototype.delete = function(done) {
  fs.unlink(this.filePath, done);
};
