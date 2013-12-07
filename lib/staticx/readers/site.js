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

  if (!dir) return {};

  var defaultPath = '../config/site/default.json';
  var configPath = path.resolve(path.join(dir, '_source', 'config.json'));

  var defaultConfigObj = {};
  var configObj = {};

  try {
    defaultConfigObj = require(defaultPath);
  } catch(e) {}
  try {
    configObj = require(configPath);
  } catch(e) {}

  return _.merge(defaultConfigObj, configObj);
}

/**
 * Read all data within a site directory.
 * @param  {String}   dir  The source directory of the site.
 * @param  {Function} done Callback function.
 */
site.read = function(dir, done) {
  var data = { config: site.getConfig(dir) };
  pagesReader.read(dir, function(err, pages) {
    if (err) throw err;
    data.pages = pages;
    done(null, data);
  });
};

site.getConfig = getConfig;
