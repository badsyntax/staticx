/*
 * staticx
 * https://github.com/badsyntax/staticx
 *
 * Copyright (c) 2013 Richard Willis
 * Licensed under the MIT license.
 */

var fs = require('fs');
var path = require('path');
var _ = require('lodash');
var Validator = require('schema-validator');

/**
 * Check if a file exists n the filesystem.
 * @param  {Object} options The validation options.
 */
Validator.implement('file-exists', function (options) {
  if (!fs.existsSync(options.data)) {
    options.error('File/folder does not exist: ' + path.resolve(options.data));
  }
});

/**
 * Check if the parent page exists on the filesystem.
 * @param  {Object} options The validation options.
 */
Validator.implement('parent-exists', function (options) {

  if (!options.data) {
    return;
  }

  var data = this.retrieved;

  var filePath = [
    path.join(data.destination, options.data),
    data.fileExtension
  ].join('.');

  if (!fs.existsSync(filePath)) {
    options.error('Parent page does not exist: ' + path.resolve(options.data));
  }
});

/**
 * A helper method to convert the validator error object into a simpler object.
 * @param  {Object} error The validate error object.
 * @return {Object}       The formatted error object in format: { error: 'Message' }
 */
Validator.formatError = function(error) {
  error = _.merge({}, error);
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

module.exports = Validator;
