'use strict';

var staticx = require('../../../lib/staticx.js');
var fs = require('fs-extra');

describe('Compiling markdown', function() {

  var compiler = staticx.compilers.markdown;

  it('Should compile markdown from a string of text.', function() {

    var text = 'some *text* here';
    var compiled;

    compiler.compile(text, function(err, data) {
      expect(err).toBe(null);
      compiled = data;
    });

    waitsFor(function() {
      return compiled !== undefined;
    }, 'Compilation took too long', 5000);

    runs(function () {
      expect(compiled.trim()).toBe('<p>some <em>text</em> here</p>');
    });
  });

  it('Should compile markdown from a file path.', function() {

    var path = 'spec/fixtures/markdown.md';
    var compiled;

    compiler.compilePath(path, function(err, data) {
      expect(err).toBe(null);
      compiled = data;
    });

    waitsFor(function() {
      return compiled !== undefined;
    }, 'Compilation took too long', 5000);

    runs(function () {
      expect(compiled.trim()).toBe('<p>some <em>text</em> here</p>');
    });
  });
});
