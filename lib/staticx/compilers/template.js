/*
 * staticx
 * https://github.com/badsyntax/staticx
 *
 * Copyright (c) 2013 Richard Willis
 * Licensed under the MIT license.
 */

'use strict';

var path = require('path');
var fs = require('graceful-fs');
var handlebars = require('handlebars');


/**
 * The template compiler.
 */
var template = module.exports = {};
var cache = { paths: {}, exists: {} };

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

  var compile = function compile() {
    this.compile(cache.paths[filePath], data, done);
  }.bind(this);

  if (!cache.paths[filePath]) {
    fs.readFile(filePath, function (err, contents) {
      if (err) return done(err);
      cache.paths[filePath] = contents.toString();
      compile();
    }.bind(this));
  } else compile();
};

template.compilePathSync = function(filePath, data) {
  if (!cache.paths[filePath]) {
    cache.paths[filePath] = fs.readFileSync(filePath).toString();
  }
  return this.compileSync(cache.paths[filePath], data);
};

/*
 * Override the handlebars invokePartial method to allow us to use partials
 * ({{> partialName}}) for including sub-views.
 */
var invokePartial = handlebars.VM.invokePartial;
handlebars.VM.invokePartial = function(partial, name, context, helpers, partials, data) {

  function compile(filePath) {
    return template.compilePathSync(filePath, context);
  }

  if (partial === undefined && context.viewPath !== undefined) {
    var dirname = path.dirname(context.viewPath);
    var filePath = path.join(dirname, name + '.html');
    if (!cache.exists[filePath]) {
      cache.exists[filePath] = fs.existsSync(filePath);
    }
    if (cache.exists[filePath]) {
      return compile(filePath);
    }
  }

  return invokePartial.apply(handlebars.VM, arguments);
};
