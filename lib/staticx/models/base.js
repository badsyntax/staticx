/*
 * staticx
 * https://github.com/badsyntax/staticx
 *
 * Copyright (c) 2013 Richard Willis
 * Licensed under the MIT license.
 */

'use strict';

var _ = require('lodash');
var util = require('util');
var fs = require('fs');
var validator = require('../validator');

/**
 * This base model provides features for managing and validating model
 * data enforced by a defined data schema.
 * @param {Object} data The model data, for example:
 * {
 *   title: "Hello, world"
 * }
 */
var BaseModel = module.exports = function(data) {
  this.setData(data);
};

/**
 * Set the model schema. The schema defines the data for the model. We don't want
 * properties and methods of the model to form part of the model data, so we use
 * the schema to track the model data. Default properties that match the schema
 * will be created when running this method. We also create a new validator
 * instance each time we set the schema.
 * @param  {Object} schema The schema object. For example:
 * date: {
 *   type: Date,
 *   required: false,
 * }
 */
BaseModel.prototype.setSchema = function(schema) {
  this.schema = _.merge(this.schema || {}, schema);
  _.forEach(this.schema, function(val, key) {
    if (this[key] === undefined) {
      this[key] = val.default === undefined ? null : val.default;
    }
  }.bind(this));
};

/**
 * Set the model data. Data is not validated against the schema. This allows you
 * to use this method to set any arbitrary data on the model instance.
 * @param  {Mixed} data  Data can be an object literal or can be a property name.
 * @param  {Mixed} value The property value.
 */
BaseModel.prototype.setData = function(data, value) {
  if (_.isString(data)) {
    this[data] = value;
  } else {
    _.merge(this, data);
  }
};

/**
 * Get model data. Retrieve data that matches the model schema.
 * @param  {String|Null} prop If null, this method will return all model data. If
 * not null, it will return the value for the specified property.
 */
BaseModel.prototype.getData = function(prop) {

  if (prop) {
    if (this.schema[prop] === undefined) {
      throw new Error(
        util.format('Prop \'%s\' not found in model schema', prop)
      );
    }
    return this[prop];
  }

  return _.transform(this.schema, function(result, val, key) {
    result[key] = this[key];
  }.bind(this));
};

/**
 * Validate the model data against the model schema.
 * @returns {Object} The errors object, or undefined. The errors object will be
 * in format: { error: 'Message' }
 */
BaseModel.prototype.validate = function() {
  return validator.validate(this.getData(), { properties: this.schema });
};
