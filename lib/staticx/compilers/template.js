/*
 * staticx
 * https://github.com/badsyntax/staticx
 *
 * Copyright (c) 2013 Richard Willis
 * Licensed under the MIT license.
 */

'use strict';

var fs = require('fs');
var handlebars = require('handlebars');

/**
 * The template compiler.
 */
var template = module.exports = {};

/**
 * Compiles from text.
 * @param {String}    template  The handlebars template.
 * @param {Object}    data      The template data.
 * @param {Function}  done      Callback function.
 */
template.compile = function(template, data, done) {
  template = handlebars.compile(template);
  done(null, template(data));
};

/**
 * Compiles from a file path.
 * @param {String} filePath The path to the template file.
 * @param {Object} data The template data.
 * @param {Function} done Callback function.
 */
template.compilePath = function(filePath, data, done) {
  fs.readFile(filePath, function (err, contents) {
    if (err) return done(err);
    this.compile(contents.toString(), data, done);
  }.bind(this));
};
