'use strict';

var _ = require('lodash');

/**
 * The base compiler.
 * @constructor
 */
var Compiler = module.exports = function(defaultOptions, options) {
  this.options = _.extend({}, defaultOptions, options || {});
};

/**
 * The Markdown compiler
 * @property {Markdown}
 */
Compiler.Markdown = require('./compiler/markdown');

/**
 * The Template compiler
 * @property {Template}
 */
Compiler.Template = require('./compiler/template');
