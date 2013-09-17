'use strict';

var staticx = require('../lib/staticx.js');

describe('Generating HTML files', function() {

  it('Compiles markdown files', function() {

    var compiler = staticx.Compiler('markdown');
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
});
