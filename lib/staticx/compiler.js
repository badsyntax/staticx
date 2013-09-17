'use strict';

var _ = require('lodash');

/**
 * The base compiler.
 * @constructor
 */
var Compiler = module.exports = function(defaultOptions, options) {
  this.options = _.extend({}, defaultOptions, options || {});
};

/* Expose the compilers as static properties. */
Compiler.Markdown = require('./compiler/markdown');
Compiler.Template = require('./compiler/template');
