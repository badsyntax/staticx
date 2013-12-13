/*
 * staticx
 * https://github.com/badsyntax/staticx
 *
 * Copyright (c) 2013 Richard Willis
 * Licensed under the MIT license.
 */

var fs = require('graceful-fs');
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
validator.parentPageExists = function (value, data) {

  if (!value) return true;
  if (!data.destination || !data.fileExtension) return false;

  var filePath = path.resolve([
    path.join(data.destination, value),
    data.fileExtension
  ].join('.'));

  return fs.existsSync(filePath);
};

module.exports = validator;
