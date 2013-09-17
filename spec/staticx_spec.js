'use strict';

var staticx = require('../lib/staticx.js');

describe('Generating HTML files', function() {

  describe('Compiling markdown', function() {

    var compiler = staticx.compiler.markdown;

    it('Compiles markdown files from a string of text.', function() {

      var text = 'some *text* here';
      var compiled;

      compiler.compile(text, function(err, data) {
        if (err) throw err;
        compiled = data;
      });

      waitsFor(function() {
        return compiled !== undefined;
      }, 'Compilation took too long', 5000);

      runs(function () {
        expect(compiled.trim()).toBe('<p>some <em>text</em> here</p>');
      });
    });

    it('Compiles markdown files from a file path.', function() {

      var path = 'spec/fixtures/compiler_file_path.md';
      var compiled;

      compiler.compilePath(path, function(err, data) {
        if (err) throw err;
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
});
