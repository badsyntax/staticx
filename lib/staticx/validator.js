/*
 * staticx
 * https://github.com/badsyntax/staticx
 *
 * Copyright (c) 2013 Richard Willis
 * Licensed under the MIT license.
 */

var fs = require('fs');
var path = require('path');
var validator = require('revalidator');

/**
 * Check if a file exists n the filesystem.
 * @param  {Object} options The validation options.
 */
validator.fileExists = function (value) {
  return fs.existsSync(path.resolve(value));
};

/**
 * Check if the parent page exists on the filesystem.
 * @param  {Object} options The validation options.
 */
validator.parentPageExists = function (value, destination, fileExtension) {

  if (!value) return true;

  destination = destination || this.destination;
  fileExtension = fileExtension || this.fileExtension;

  var filePath = [
    path.join(destination, '_pages', value),
    fileExtension
  ].join('.');

  return fs.existsSync(path.resolve(filePath));
};

module.exports = validator;
