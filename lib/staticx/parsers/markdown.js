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

  var markdownText = this.getMarkdownText(data);
  var metadataText = this.getMetadataText(data, markdownText);
  var metadata = this.parseMetadata(metadataText);

  done(null, {
    metadata: metadata,
    markdown: markdownText
  });
};

/**
 * Parses from a file path.
 * @method
 */
markdown.parseFile = function(filePath, done) {
  fs.readFile(filePath, function (err, data) {
    if (err) return done(err);
    this.parse(data.toString(), done);
  }.bind(this));
};

/**
 * Extract the markdown text (without the metadata).
 * @param  {String} data The string of markdown (which might include metadata).
 * @return {String}      The markdown without the metadata section.
 */
markdown.getMarkdownText = function(data) {

  // Pattern for matching the metadata section at the top of a string of
  // markdown text.
  var metadataPattern = [
    '^',
    METADATA_TOKEN_START,
    '\\n(?:.|\\s)*?\\n\\s*',
    METADATA_TOKEN_END,
    '\\n'
  ].join('');

  var metadataRegExp = new RegExp(metadataPattern, 'm');

  return data
    .replace(metadataRegExp, '')
    .trim();
};

/**
 * Extract the metadata text.
 * @param  {String} data         The string of markdown (which might contain metadata).
 * @param  {String} markdownText The extracted markdown text (without the metadata section)
 * @return {String}              The metadata text.
 */
markdown.getMetadataText = function(data, markdownText) {

  // Pattern for matching both start and end metadata section tokens.
  var tokenPattern = [
    '(',
    METADATA_TOKEN_START,
    '|',
    METADATA_TOKEN_END,
    ')'
  ].join('');

  var tokenRegExp = new RegExp(tokenPattern, 'gm');

  return data
    .replace(markdownText, '')
    .replace(tokenRegExp, '')
    .trim();
};

/**
 * Parses a string of metadata into a JS object.
 * @param  {String} metadata A string of metadata.
 * @return {Object}          The parsed metadata object.
 */
markdown.parseMetadata = function(metadata) {
  var obj = {};
  metadata.split('\n').forEach(this.parseMetadataRow.bind(this, obj));
  return obj;
};

/**
 * Parses a row of metadata.
 * @param  {Object} obj The object to hold the metadata key:value pairs.
 * @param  {String} row The row of metadata.
 */
markdown.parseMetadataRow = function(obj, row) {

  row = row.trim();

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
};
