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

exports.pkg       = require('../package');

/** Modules */
exports.compilers = require('./staticx/compilers');
exports.parsers   = require('./staticx/parsers');
exports.scaffold  = require('./staticx/scaffold');
exports.readers   = require('./staticx/readers');
exports.models    = require('./staticx/models');

/** Shortcuts **/
exports.create    = exports.scaffold.create;
exports.addPage   = exports.scaffold.addPage;
