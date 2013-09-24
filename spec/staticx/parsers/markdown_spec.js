'use strict';

var staticx = require('../../../lib/staticx');
var async = require('async');

describe('Parsing markdown', function() {

  var markdown = staticx.parsers.markdown;

  function runTest(method, text, testHandler) {

    var parsed;

    markdown[method](text, function(err, obj) {
      if (err) {
        throw err;
      }
      parsed = obj;
    });

    waitsFor(function() {
      return parsed !== undefined;
    }, 'Parsing took too long', 1000);

    runs(function(){
      testHandler(parsed);
    });
  }

  it('Should not extract the metadata if it\'s badly formatted', function() {

    function noMetadataSection(done) {
      var text = 'some *markdown* text';
      runTest('parse', text, function(parsed) {
        expect(typeof parsed.metadata).toBe('object');
        expect(Object.keys(parsed.metadata).length).toBe(0);
        done(null);
      });
    }

    function incorrectLeadingChars(done) {
      var text = '----\n' +
        'title: Example text\n' +
        '---\n\n' +
        'some *markdown* text';
      runTest('parse', text, function(parsed) {
        expect(typeof parsed.metadata).toBe('object');
        expect(Object.keys(parsed.metadata).length).toBe(0);
        done(null);
      });
    }

    function incorrectTrailingChars(done) {
      var text = '---\n' +
        'title: Example text\n' +
        '----\n\n' +
        'some *markdown* text';
      runTest('parse', text, function(parsed) {
        expect(typeof parsed.metadata).toBe('object');
        expect(Object.keys(parsed.metadata).length).toBe(0);
        done(null);
      });
    }

    function incorrectLeadingWhiteSpace(done) {
      var text = ' ---\n' +
        'title: Example text\n' +
        '---\n\n' +
        'some *markdown* text';
      runTest('parse', text, function(parsed) {
        expect(typeof parsed.metadata).toBe('object');
        expect(Object.keys(parsed.metadata).length).toBe(0);
        done(null);
      });
    }

    function incorrectTrailingWhiteSpace(done) {
      var text = '---\n' +
        'title: Example text\n' +
        ' ---\n\n' +
        'some *markdown* text';
      runTest('parse', text, function(parsed) {
        expect(typeof parsed.metadata).toBe('object');
        expect(Object.keys(parsed.metadata).length).toBe(0);
        done(null);
      });
    }

    function incorrectDataRowFormat(done) {
      var text = '---\n' +
        'title Example text\n' +
        'tags: tag1, tag2\n' +
        '---\n\n' +
        'some *markdown* text';
      runTest('parse', text, function(parsed) {
        expect(typeof parsed.metadata).toBe('object');
        expect(parsed.metadata.tags instanceof Array).toBe(true);
        expect(parsed.metadata.tags).toEqual(['tag1','tag2']);
        expect(typeof parsed.metadata.title).toBe('undefined');
        done(null);
      });
    }

    async.parallel([
      noMetadataSection,
      incorrectLeadingChars,
      incorrectTrailingChars,
      incorrectLeadingWhiteSpace,
      incorrectTrailingWhiteSpace,
      incorrectDataRowFormat
    ]);
  });

  it('Should extract the metadata and markdown', function() {

    function defaultProperties() {
      var text = '---\n' +
        'key: value\n' +
        'title: Example text\n' +
        '---\n\n' +
        'some *markdown* text';
      runTest('parse', text, function(parsed) {
        expect(typeof parsed).toBe('object');
        expect(typeof parsed.metadata).toBe('object');
        expect(parsed.metadata.key).toBe('value');
        expect(parsed.metadata.title).toBe('Example text');
        expect(typeof parsed.markdown).toBe('string');
        expect(parsed.markdown).toBe('some *markdown* text');
      });
    }

    function tags() {
      var text = '---\n' +
        'title: Example text\n' +
        'tags: tag1, tag2, tag3\n' +
        '---\n\n' +
        'some *markdown* text';
      runTest('parse', text, function(parsed) {
        expect(typeof parsed).toBe('object');
        expect(typeof parsed.metadata).toBe('object');
        expect(parsed.metadata.tags).toEqual(['tag1','tag2','tag3']);
        expect(typeof parsed.markdown).toBe('string');
        expect(parsed.markdown).toBe('some *markdown* text');
      });
    }

    function extraWhiteSpace() {
      var text = '---\n' +
        'title:  Example text    \n' +
        'tags:    tag1,          tag2  \n' +
        '---\n\n' +
        'some *markdown* text';
      runTest('parse', text, function(parsed) {
        expect(typeof parsed).toBe('object');
        expect(typeof parsed.metadata).toBe('object');
        expect(parsed.metadata.title).toBe('Example text');
        expect(parsed.metadata.tags).toEqual(['tag1','tag2']);
        expect(typeof parsed.markdown).toBe('string');
        expect(parsed.markdown).toBe('some *markdown* text');
      });
    }

    async.parallel([
      defaultProperties,
      tags,
      extraWhiteSpace
    ]);
  });

  it('Should extract the metadata and markdown from a file', function() {

    var path = 'spec/fixtures/markdown_with_metadata.md';

    runTest('parseFile', path, function(parsed) {
      expect(typeof parsed).toBe('object');
      expect(typeof parsed.metadata).toBe('object');
      expect(parsed.metadata.title).toBe('Example title');
      expect(parsed.metadata.tags).toEqual(['tag1','tag2']);
      expect(typeof parsed.markdown).toBe('string');
      expect(parsed.markdown).toBe('some *markdown* text');
    });
  });
});
