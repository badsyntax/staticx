'use strict';

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