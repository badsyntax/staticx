/*
 * staticx
 * https://github.com/badsyntax/staticx
 *
 * Copyright (c) 2013 Richard Willis
 * Licensed under the MIT license.
 */

'use strict';

var fs = require('fs-extra');
var path = require('path');
var async = require('async');
var templateCompiler = require('../../lib/staticx/compilers/template');
var siteReader = require('../../lib/staticx/readers/site');
var FileStore = require('../../lib/staticx/stores/File');

/**
 * Base ViewModel
 * @param  {String} viewPath    The full path of the view file (excluding extension),
 * for example: '/path/to/view'
 * @param  {String} destination The site destination directory.
 * @param  {Object} data        View data object.
 */
var ViewModel = module.exports = function(viewPath, destination, data) {
  this.viewPath = viewPath + '.html';
  this.destination = destination;
  this.config = siteReader.getConfig(destination);
  this.store = new FileStore();
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

  var viewPath = path.join(destination, '_source', 'views', name);
  var viewModelPath = path.join(destination, '_source', 'viewModels', name);
  var VM;

  try {
    VM = require(viewPath);
  } catch(e) {
    VM = ViewModel;
  }

  return new VM(viewPath, destination, data);
};

/**
 * Set data on the ViewModel instance.
 * @param  {Object} data View data object.
 */
ViewModel.prototype.setData = function(data) {
  data = data || {};
  for(var key in data) {
    this[key] = data[key];
  }
};

/**
 * Render the ViewModel. If any of the properties on this ViewModel are other
 * instances of ViewModels, then we'll render those first.
 * @param  {Function} done Callback function.
 */
ViewModel.prototype.render = function(done) {

  var props = [];
  var asyncMethods = [];

  Object.keys(this).forEach(function(prop) {
    if (this[prop] instanceof ViewModel) {
      props.push(prop);
      asyncMethods.push(this[prop].render.bind(this[prop]));
    }
  }.bind(this));

  if (asyncMethods.length) {
    async.parallel(asyncMethods, function(err, rendered) {
      rendered.forEach(function(html, i) {
        this[props[i]] = html; //Over-write this property with the rendered HTML.
        templateCompiler.compilePath(this.viewPath, this, done);
      }.bind(this));
    }.bind(this));
  } else {
    templateCompiler.compilePath(this.viewPath, this, done);
  }
};

/**
 * Render the ViewModel and save to file.
 * @param  {String}   fileName The name of the file.
 * @param  {String}   filePath The full path of the file to save.
 * @param  {Function} done     Callback function.
 */
ViewModel.prototype.renderFile = function(fileName, filePath, done) {
  this.render(function(err, html) {
    if (err) return done(err);
    this.save(fileName, filePath, html, done);
  }.bind(this));
};

/**
 * Save the ViewModel's rendered HTML to file.
 * @param  {String}   fileName The name of the file.
 * @param  {String}   filePath The full path of the file to save.
 * @param  {String}   html     The rendered HTML.
 * @param  {Function} done     Callback function.
 */
ViewModel.prototype.save = function(fileName, filePath, html, done) {

  var baseName = path.basename(fileName);
  var dirs = path.dirname(filePath).split(path.sep);

  // Filter out the '_pages' and '_source' directories.
  filePath = dirs.filter(function(dir) {
    return (dir !== '_pages' && dir !== '_source');
  });

  // Change the file extension.
  filePath.push(baseName.substr(0, baseName.lastIndexOf('.')) + '.' + (this.config.urlExtension || 'html'));

  this.store.filePath = path.join.apply(path, filePath);
  this.store.save(html, done);
};
