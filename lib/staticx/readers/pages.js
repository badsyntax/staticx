/*
 * staticx
 * https://github.com/badsyntax/staticx
 *
 * Copyright (c) 2013 Richard Willis
 * Licensed under the MIT license.
 */

'use strict';

var glob = require('glob');
var fs = require('fs');
var path = require('path');
var async = require('async');
var _ = require('lodash');
var markdownParser = require('../parsers/markdown');
var markdownCompiler = require('../compilers/markdown');
var PageModel = require('../models/page');


/**
 * The Pages reader.
 *
 */
var pages = module.exports = {};


pages.read = function(source, done) {

  fs.exists(source, function(exists) {

    if (!exists) return done('Source directory does not exist: ' + source);

    var data = [];

    glob("**/*.md", {
      cwd: path.resolve(source)
    }, function (err, files) {
      if (err) throw err;
      async.each(files, function(file, callback) {
        file = path.join(source, file);
        markdownParser.parseFile(file, function(err, obj) {
          if (err) throw err;
          markdownCompiler.compile(obj.markdown, function(err, content) {
            if (err) throw err;

            data.push(new PageModel(_.merge({}, {
              filePath: file,
              content: content
            }, obj.metadata)));

            callback(null);
          });
        });
      }, function(err) {
        if (err) throw err;
        done(null, data);
      });
    });
  });
};
