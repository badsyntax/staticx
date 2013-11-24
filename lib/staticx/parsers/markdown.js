/*
 * staticx
 * https://github.com/badsyntax/staticx
 *
 * Copyright (c) 2013 Richard Willis
 * Licensed under the MIT license.
 */

'use strict';

var fs = require('fs');

/**
 * The Markdown parser.
 * @example
 * var markdownText = '*hello*';
 * var parser = require('parsers/markdown');
 * parser.parse(markdownText, function(err, data) {
 *   if (err) throw err;
 *   console.log(data);
 * });
 *
 */
var markdown = module.exports = {};

/*
 * Start and end token characters for matching the metadata sections in
 * markdown text.
 */
var METADATA_TOKEN_START = '---';
var METADATA_TOKEN_END = METADATA_TOKEN_START;
var ANY_CHAR_MULTILINE = '(?:.|\\s)*';

/**
 * Parses the markdown text into metadata and markdown sections.
 * @param {String}    data  The markdown data string to parse.
 * @param {Function}  done  Callback function.
 */
markdown.parse = function(data, done) {

  var markdownText = this.getMarkdownText(data);
  var metadataText = this.getMetadataText(data, markdownText);
  var metadata = this.parseMetadata(metadataText);

  done(null, {
    metadata: metadata,
    markdown: markdownText
  });
};

/**
 * Parses metadata from a file path.
 * @param {String}    filePath  The path to the file to parse.
 * @param {Function}  done      Callback function.
 */
markdown.parseFile = function(filePath, done) {
  fs.readFile(filePath, function (err, data) {
    if (err) return done(err);
    this.parse(data.toString(), done);
  }.bind(this));
};

/**
 * Extract the markdown text (without the metadata section).
 * @param  {String} data The string of markdown (which might include metadata).
 * @return {String}      The markdown without the metadata section.
 */
markdown.getMarkdownText = function(data) {

  // Pattern for matching the metadata section at the top of a string of
  // markdown text.
  var metadataPattern = [
    '^',
    METADATA_TOKEN_START,
    '\\n',
    ANY_CHAR_MULTILINE,
    '?\\n',
    METADATA_TOKEN_END,
    '\\n'
  ].join('');

  var metadataRegExp = new RegExp(metadataPattern, 'm');

  return data
    .replace(metadataRegExp, '') // Remove the metadata section from the text.
    .trim();
};

/**
 * Extract the metadata text (without the markdown section).
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
    .replace(markdownText, '')  // Remove the mardown text to get the metadata text.
    .replace(tokenRegExp, '')   // Remove the metadata tokens from the metadata text.
    .trim();
};

/**
 * Parses a string of metadata into a JS object.
 * @param  {String} metadata A string of metadata.
 * @return {Object}          The parsed metadata object.
 */
markdown.parseMetadata = function(metadata) {

  var obj = {};
  var rows = metadata.split('\n');

  // Parse each row of metadata.
  rows.forEach(
    this.parseMetadataRow.bind(this, obj)
  );

  return obj;
};

/**
 * Parses a row of metadata text.
 * @param  {Object} obj The object to hold the metadata key:value pairs.
 * @param  {String} row The row of metadata.
 */
markdown.parseMetadataRow = function(obj, row) {

  row = row.trim();

  // Skip parsing if validation of row format fails.
  if (row.indexOf(':') === -1) {
    return;
  }

  var property = row.replace(/:.*?$/, '');
  var value = row.replace(/^.*?:\s+/, '');

  switch(property) {
    case 'tags':
      // Tags can only be delimited by the comma char.
      value = value.replace(/,\s*/g, ',').split(',');
      break;
  }

  obj[property] = value;
};
