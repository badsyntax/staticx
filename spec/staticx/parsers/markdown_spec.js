'use strict';

var staticx = require('../../../lib/staticx');
var async = require('async');

describe('Parsing markdown', function() {

  var markdown = staticx.parsers.markdown;

  function runTest(text, testHandler, done) {

    var parsed;

    markdown.parse(text, function(err, obj) {
      if (err) {
        throw err;
      }
      parsed = obj;
    });

    waitsFor(function() {
      return parsed !== undefined;
    }, 'Compilation took too long', 1000);

    runs(function(){
      testHandler(parsed);
    });
  }

  it('Should extract the metadata and markdown', function() {

    var text = '---\n' +
      'title: Example text\n' +
      'tags: tag1, tag2\n' +
      '---\n\n' +
      'some *markdown* text';

    runTest(text, function(parsed) {
      expect(typeof parsed).toBe('object');
      expect(typeof parsed.metadata).toBe('object');
      expect(parsed.metadata.title).toBe('Example text');
      expect(parsed.metadata.tags).toEqual(['tag1','tag2']);
      expect(typeof parsed.markdown).toBe('string');
      expect(parsed.markdown).toBe('some *markdown* text');
    });
  });

  it('Should not extract the metadata if it\'s badly formatted', function() {

    // Incorrect leading characters.
    function test1(done) {
      var text = '----\n' +
        'title: Example text\n' +
        'tags: tag1, tag2\n' +
        '---\n\n' +
        'some *markdown* text';
      runTest(text, function(parsed) {
        expect(Object.keys(parsed.metadata).length).toBe(0);
        done(null);
      });
    }

    // Incorrect data row format.
    function test2(done) {
      var text = '---\n' +
        'title Example text\n' +
        'tags: tag1, tag2\n' +
        '---\n\n' +
        'some *markdown* text';
      runTest(text, function(parsed) {
        expect(typeof parsed.metadata).toBe('object');
        expect(parsed.metadata.tags instanceof Array).toBe(true);
        expect(typeof parsed.metadata.title).toBe('undefined');
        done(null);
      });
    }

    async.parallel([test1, test2]);
  });
});
