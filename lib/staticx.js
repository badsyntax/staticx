/*
 * staticx
 * https://github.com/badsyntax/staticx
 *
 * Copyright (c) 2013 Richard Willis
 * Licensed under the MIT license.
 */

'use strict';

/**
 * Set module defaults.
 */
require('globalize').culture('en');

/**
 * Our main public API.
 * @name staticx
 * @namespace
 */
var staticx = module.exports = {};

/* Package config */
staticx.pkg       = require('../package');

/* Modules */
staticx.compilers = require('./staticx/compilers');
staticx.parsers   = require('./staticx/parsers');
staticx.scaffold  = require('./staticx/scaffold');
staticx.validator = require('./staticx/validator');
staticx.readers   = require('./staticx/readers');
staticx.models    = require('./staticx/models');
staticx.config    = require('./staticx/config');

/* Shortcuts **/
staticx.create    = staticx.scaffold.create;
staticx.addPage   = staticx.scaffold.addPage;

staticx.init = function(options) {
  if (!options.destination)
    throw new Error('staticx requires a destination directory');
  staticx.config.site = staticx.readers.site.getConfig(options.destination);
};
