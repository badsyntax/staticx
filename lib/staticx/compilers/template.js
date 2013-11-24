/*
 * staticx
 * https://github.com/badsyntax/staticx
 *
 * Copyright (c) 2013 Richard Willis
 * Licensed under the MIT license.
 */

'use strict';

var path = require('path');
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

template.compileSync = function(template, data) {
  template = handlebars.compile(template);
  return template(data);
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

template.compilePathSync = function(filePath, data) {
  var contents = fs.readFileSync(filePath);
  return this.compileSync(contents.toString(), data);
};

/*
 * Override the handlebars invokePartial method to allow us to use partials
 * ({{> partialName}}) for including sub-views.
 */
var invokePartial = handlebars.VM.invokePartial;
handlebars.VM.invokePartial = function(partial, name, context, helpers, partials, data) {

  if (partial === undefined && context.viewPath !== undefined) {
    var dirname = path.dirname(context.viewPath);
    var filePath = path.join(dirname, name + '.html');
    if (fs.existsSync(filePath)) {
      return template.compilePathSync(filePath, context);
    }
  }

  return invokePartial.apply(handlebars.VM, arguments);
};
