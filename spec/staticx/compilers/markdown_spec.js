/*
 * staticx
 * https://github.com/badsyntax/staticx
 *
 * Copyright (c) 2013 Richard Willis
 * Licensed under the MIT license.
 */
'use strict';

var staticx = require('../../../lib/staticx');
var fs = require('fs-extra');

describe('Compiling markdown', function() {

  var compiler = staticx.compilers.markdown;

  it('Should compile markdown from a string of text.', function(done) {

    var text = 'some *text* here';
    var compiled;

    compiler.compile(text, function(err, data) {
      if (err) return done(err);
      expect(data.trim()).toBe('<p>some <em>text</em> here</p>');
      done();
    });
  });

  it('Should compile markdown from a file path.', function(done) {

    var path = 'spec/fixtures/markdown.md';

    compiler.compilePath(path, function(err, data) {
      if (err) return done(err);
      expect(data.trim()).toBe('<p>some <em>text</em> here</p>');
      done();
    });
  });
});
