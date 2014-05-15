/*
 * staticx
 * https://github.com/badsyntax/staticx
 *
 * Copyright (c) 2013 Richard Willis
 * Licensed under the MIT license.
 */

'use strict';

var fs = require('fs-extra');
var _ = require('lodash');
var path = require('path');
var async = require('async');
var handlebars = require('handlebars');
var templateCompiler = require('../../lib/staticx/compilers/template');
var siteReader = require('../../lib/staticx/readers/site');
var FileStore = require('../../lib/staticx/stores/File');

var cache = {};

/**
 * Base ViewModel
 * @param  {String} viewPath    The full path of the view file (excluding extension),
 * for example: '/path/to/view'
 * @param  {String} destination The site destination directory.
 * @param  {Object} data        View data object.
 */
var ViewModel = module.exports = function(viewPath, destination, siteConfig, data) {
  this.viewPath = viewPath ? viewPath + '.html' : null;
  this.destination = destination;
  this.config = siteConfig;
  this.store = new FileStore();
  this.data = { viewPath: this.viewPath };
  this.setData(data);
};

/**
 * Factory method for loading and instantiating ViewModels.
 * @param  {String} name Name of the viewModel
 * @param  {String} destination  The site destination directory.
 * @param  {Object} data View data object.
 * @return {ViewModel} The ViewModel instance.
 */
ViewModel.factory = function(name, destination, data) {

  if (!name || !destination)
    return null;

  var config = siteReader.getConfig(destination);
  var viewPath = path.resolve(path.join(
    destination, '_source', 'themes', config.theme, 'views', name
  ));
  var cacheId = name + destination;
  var VM = cache[cacheId];

  if (VM === undefined) {

    var viewModelPath = path.resolve(path.join(
      destination, '_source', 'themes', config.theme, 'viewModels', name + '.js'
    ));

    if (fs.existsSync(viewModelPath)) {
      VM = require(viewModelPath)(ViewModel);
    } else {
      VM = ViewModel;
    }
    cache[cacheId] = VM;
  }


  return new VM(viewPath, destination, config, data);
};

/**
 * Set data on the ViewModel.
 * @param  {Object} data View data object.
 */
ViewModel.prototype.setData = function(data, value) {
  if (_.isString(data)) this.data[data] = value;
  else _.merge(this.data, data);
};

/**
 * Render the ViewModel. If any of the properties on this ViewModel are other
 * instances of ViewModels, then we'll render those first.
 * @param  {Function} done Callback function.
 */
ViewModel.prototype.render = function(done) {

  var props = [];
  var methods = [];

  Object.keys(this.data).forEach(function(prop) {
    if (this.data[prop] instanceof ViewModel) {
      props.push(prop);
      methods.push(this.data[prop].render.bind(this.data[prop]));
    }
  }.bind(this));

  if (methods.length) {
    async.parallel(methods, function onComplete(err, rendered) {
      rendered.forEach(function(html, i) {
        this.data[props[i]] = html;
      }.bind(this));
      templateCompiler.compilePath(this.viewPath, this.data, done);
    }.bind(this));
  } else {
    templateCompiler.compilePath(this.viewPath, this.data, done);
  }
};

/**
 * Synchronous render. If any of the data properties are ViewModels, then render
 * those before rendering this ViewModel.
 */
ViewModel.prototype.renderSync = function() {

  Object.keys(this.data).forEach(function(prop) {
    if (this.data[prop] instanceof ViewModel) {
      this.data[prop] = this.data[prop].renderSync();
    }
  }.bind(this));

  return templateCompiler.compilePathSync(this.viewPath, this.data);
};

/**
 * Save the rendered HTML to file.
 * @param  {String}   fileName The name of the file.
 * @param  {String}   filePath The full path of the file to save.
 * @param  {Function} done     Callback function.
 */
ViewModel.prototype.save = function(filePath, done) {
  this.render(function onRender(err, html) {
    if (err) return done(err);

    var baseName = path.basename(filePath);
    var dirs = path.dirname(filePath).split(path.sep);

    // Filter out the 'pages' and '_source' directories.
    filePath = dirs.filter(function(dir) {
      return (dir !== 'pages' && dir !== '_source');
    });

    // Change the file extension.
    filePath.push(baseName.substr(0, baseName.lastIndexOf('.')) + '.' + (this.config.urlExtension || 'html'));

    this.store.filePath = path.join.apply(path, filePath);
    this.store.save(html, done);
  }.bind(this));
};


