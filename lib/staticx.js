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
 * Our main library.
 * @name staticx
 * @namespace
 */

var compilers = exports.compilers = require('./staticx/compilers');
var parsers = exports.parsers = require('./staticx/parsers');
var scaffold = exports.scaffold = require('./staticx/scaffold');

exports.create = function(options, done) {
  scaffold.create(options, function(err) {
    if (err) return done(err);
    done();
  });
};
