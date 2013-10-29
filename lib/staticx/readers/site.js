/*
 * staticx
 * https://github.com/badsyntax/staticx
 *
 * Copyright (c) 2013 Richard Willis
 * Licensed under the MIT license.
 */

'use strict';

var path = require('path');
var pagesReader = require('./pages');

/**
 * The Site reader.
 *
 */
var site = module.exports = {};

site.read = function(dir, done) {

  var configPath = path.resolve(path.join(dir, 'config.json'));

  var data = {
    config: require(configPath)
  };

  pagesReader.read(dir, function(err, pages) {
    if (err) throw err;
    data.pages = pages;
    done(null, data);
  });
};
