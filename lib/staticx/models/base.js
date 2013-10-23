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
var Validator = require('schema-validator');

// Set custom schema validator tests.
Validator.implement("fs-exists", function (options) {
  if (!fs.existsSync(options.data)) {
    options.error('Does not exist: ' + options.data);
  }
});

/**
 * This base model provides features for managing and validating model
 * data enforced by a defined data schema.
 */
var BaseModel = module.exports = function(data) {
  this.setData(data);
  this.validator = new Validator(this.schema);
  this.validator.debug = true;
};

/**
 * Set the model schema. The schema defines the data for the model. We don't want
 * properties and methods of the model to form part of the model data, so we use
 * the schema to track the model data. Default properties that match the schema
 * will be created when running this method.
 * @param  {object} schema The schema object. For example:
 * date: {
 *   type: Date,
 *   required: false,
 * }
 */
BaseModel.prototype.setSchema = function(schema) {
  this.schema = _.merge(this.schema || {}, schema);
  _.forEach(this.schema, function(val, key) {
    if (this[key] === undefined) {
      this[key] = val.default || null;
    }
  }.bind(this));
};

/**
 * Set the model data. Data is not validated against the schema. This allows you
 * to use this method to set any data on the model instance.
 * @param  {mixed} data  Data can be an object literal or can be a property name.
 * @param  {value} value The property value;
 */
BaseModel.prototype.setData = function(data, value) {
  if (_.isString(data)) {
    this[data] = value;
  } else {
    _.merge(this, data);
  }
};

/**
 * Get model data. You can only use this method to retrieve data that matches the
 * model schema.
 * @param  {string|null} prop If null, this method will return all model data. If
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
  } else {
    var data = {};
    _.forEach(this.schema, function(val, key) {
      data[key] = this[key];
    }.bind(this));
    return data;
  }
};

/**
 * Validate the model data against the model schema.
 */
BaseModel.prototype.validate = function() {

  var validate = this.validator.check(this.getData());

  if (!validate._error) {
    return;
  }

  var error = _.merge({}, validate);
  delete error['_error'];

  for(var key in error) {
    for(var k in error[key]) {
      return {
        key: key,
        message: error[key][k].message
      };
    }
  }
};
