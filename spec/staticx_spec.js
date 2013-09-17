'use strict';

var staticx = require('../lib/staticx.js');

describe('Generating HTML files', function() {

  it('Compiles markdown files', function() {

    var compiler = staticx.Compiler('markdown');
    var text = 'some *text* here';

    compiler.compile(text, function(err, data) {

      if (err) throw err;

      expect(data).toBe('<p>some <em>text</em> here</p>');
    });
  });
});
