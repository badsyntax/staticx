/*
 * staticx
 * https://github.com/badsyntax/staticx
 *
 * Copyright (c) 2013 Richard Willis
 * Licensed under the MIT license.
 */

'use strict';

var fs = require('fs');
var path = require('path');

/**
 * Our main public API.
 * @name staticx
 * @namespace
 */

exports.pkg = require('../package');
exports.compilers = require('./staticx/compilers');
exports.parsers = require('./staticx/parsers');
exports.scaffold = require('./staticx/scaffold');
exports.create = exports.scaffold.create;
