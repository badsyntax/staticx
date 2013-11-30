/*
 * staticx
 * https://github.com/badsyntax/staticx
 *
 * Copyright (c) 2013 Richard Willis
 * Licensed under the MIT license.
 */

'use strict';

var scaffold = require('./staticx/scaffold');
var generator = require('./staticx/generator');

/**
 * Set module defaults.
 */
require('globalize').culture('en');

/**
 * Our main public API.
 * @name staticx
 * @namespace
 */
module.exports = {
  pkg: require('../package'),
  create: scaffold.create,
  addPage: scaffold.addPage,
  generate: generator.generate
};
