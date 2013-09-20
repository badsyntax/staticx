'use strict';

var fs = require('fs');


/**
 * The Markdown parser.
 */
var markdown = module.exports = {};

/**
 * Start and end token characters for matching the metadata sections in
 * markdown text.
 */
var METADATA_TOKEN_START = '---';
var METADATA_TOKEN_END = METADATA_TOKEN_START;

/**
 * Parses the markdown text into metadata and markdown sections.
 * @method
 */
markdown.parse = function(data, done) {

  data = data.trim();

  // Pattern for matching the metadata section at the top of a string of
  // markdown text.
  var metadataPattern = [
    '^',
    METADATA_TOKEN_START,
    '\\n(?:.|\\s)*?\\n',
    METADATA_TOKEN_END,
    '\\n'
  ].join('');

  // Pattern for matching both start and end metadata section tokens.
  var tokenPattern = [
    '(',
    METADATA_TOKEN_START,
    '|',
    METADATA_TOKEN_END,
    ')'
  ].join('');

  var metadataRegExp = new RegExp(metadataPattern, 'm');
  var tokenRegExp = new RegExp(tokenPattern, 'gm');

  // Extract the markdown and metadata sections.
  var markdownText = data.replace(metadataRegExp, '').trim();
  var metadataText = data.replace(markdownText, '').replace(tokenRegExp, '').trim();

  done(null, {
    metadata: this.parseMetadata(metadataText),
    markdown: markdownText
  });
};

/**
 * Parses a string of metadata into a JS object.
 * @param  {String} metadata A string of metadata.
 * @return {Object}          The parsed metadata object.
 */
markdown.parseMetadata = function(metadata) {

  var obj = {};

  function parseRow(row) {

    if (row.indexOf(':') === -1) {
      return;
    }

    var property = row.replace(/:.*?$/, '');
    var value = row.replace(/^.*?:\s+/, '');

    switch(property) {
      case 'tags':
        value = value.replace(/,\s*/, ',').split(',');
        break;
    }

    obj[property] = value;
  }

  if (metadata.length) {
    metadata.split('\n').forEach(parseRow);
  }

  return obj;
};

/**
 * Compiles from a file path.
 * @method
 */
markdown.parseFile = function(filePath, done) {
  var data = '';
  this.parse(data, done);
};
