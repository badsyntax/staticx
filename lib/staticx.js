/*
 * staticx
 * https://github.com/badsyntax/staticx
 *
 * Copyright (c) 2013 Richard Willis
 * Licensed under the MIT license.
 */

'use strict';

/**
 * Set lib defaults.
 */
require('globalize').culture('en');

/**
 * Our main public API.
 * @name staticx
 * @namespace
 */
exports.pkg       = require('../package');

exports.compilers = require('./staticx/compilers');
exports.parsers   = require('./staticx/parsers');
exports.scaffold  = require('./staticx/scaffold');
exports.models    = require('./staticx/models');

exports.create    = exports.scaffold.create;
exports.addPage   = exports.scaffold.addPage;
