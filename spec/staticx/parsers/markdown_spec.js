'use strict';

var staticx = require('../../../lib/staticx');

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

  describe('Extracting the metadata if it\'s badly formatted', function() {

    it('Should not extract metadata if there is no metadata section', function() {
      var text = 'some *markdown* text';
      runTest('parse', text, function(parsed) {
        expect(typeof parsed.metadata).toBe('object');
        expect(Object.keys(parsed.metadata).length).toBe(0);
      });
    });

    it('Should not extra metadat if there is incorrect leading characters', function() {
      var text = '----\n' +
        'title: Example text\n' +
        '---\n\n' +
        'some *markdown* text';
      runTest('parse', text, function(parsed) {
        expect(typeof parsed.metadata).toBe('object');
        expect(Object.keys(parsed.metadata).length).toBe(0);
      });
    });

    it('Should not extract metadata if there is incorrect trailing characters', function() {
      var text = '---\n' +
        'title: Example text\n' +
        '----\n\n' +
        'some *markdown* text';
      runTest('parse', text, function(parsed) {
        expect(typeof parsed.metadata).toBe('object');
        expect(Object.keys(parsed.metadata).length).toBe(0);
      });
    });

    it('Should not extract metadata if there is incorrect leading white space', function() {
      var text = ' ---\n' +
        'title: Example text\n' +
        '---\n\n' +
        'some *markdown* text';
      runTest('parse', text, function(parsed) {
        expect(typeof parsed.metadata).toBe('object');
        expect(Object.keys(parsed.metadata).length).toBe(0);
      });
    });

    it('Should not extract metadata if there is incorrect trailing whitespace', function() {
      var text = '---\n' +
        'title: Example text\n' +
        ' ---\n\n' +
        'some *markdown* text';
      runTest('parse', text, function(parsed) {
        expect(typeof parsed.metadata).toBe('object');
        expect(Object.keys(parsed.metadata).length).toBe(0);
      });
    });

    it('Should not extract metadata from a row if the row if is not formatted correctly.', function() {
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
      });
    });
  });

  describe('Extracting the metadata and markdown when correctly formatted.', function() {

    it('Should extract default properties from the metadata', function() {
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
    });

    it('Should extract the tags as an array from the metadata', function() {
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
    });

    it('Should extract the metadata when there is excessive whitespace', function() {
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
});
