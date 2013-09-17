'use strict';

var path = require('path');
var fs = require('fs');
var marked = require('marked');

var options = {
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: true,
  smartLists: true,
  smartypants: false,
  langPrefix: 'lang-'
};

exports.compile = function(data, done) {
  marked(data, options, done);
};

exports.compilePath = function(filePath, done) {
  fs.readFile(path.resolve(filePath), function (err, data) {
    if (err) throw err;
    exports.compile(data.toString(), done);
  });
};
