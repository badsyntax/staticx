/*
 * staticx
 * https://github.com/badsyntax/staticx
 *
 * Copyright (c) 2013 Richard Willis
 * Licensed under the MIT license.
 */

'use strict';

var _ = require('lodash');
var path = require('path');
var pagesReader = require('./pages');

/**
 * The Site reader.
 *
 */
var site = module.exports = {};

/**
 * Merge the site config with default content.
 * @param  {String} dir The source directory of the site.
 * @return {Object}     The merged config object.
 */
function getConfig(dir) {
  var defaultPath = '../config/site/default.json';
  var configPath = path.resolve(path.join(dir, 'config.json'));
  return _.merge(
    require(defaultPath),
    require(configPath)
  );
}

/**
 * Read all data within a site directory.
 * @param  {String}   dir  The source directory of the site.
 * @param  {Function} done Callback function.
 */
site.read = function(dir, done) {
  var data = { config: site.config(dir) };
  pagesReader.read(dir, function(err, pages) {
    if (err) throw err;
    data.pages = pages;
    done(null, data);
  });
};

site.config = function(dir, done) {
  return getConfig(dir);
};
