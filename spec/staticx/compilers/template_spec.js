/*
 * staticx
 * https://github.com/badsyntax/staticx
 *
 * Copyright (c) 2013 Richard Willis
 * Licensed under the MIT license.
 */
'use strict';

var compiler = require('../../../lib/staticx/compilers/template');
var fs = require('fs-extra');

describe('Compiling templates', function() {

  it('Should compile the template from a string of text', function(done) {

    var template = '<h1>{{title}}</h1>';
    var data = { title: 'test' };

    compiler.compile(template, data, function(err, result) {
      if (err) return done(err);
      expect(result.trim()).toBe('<h1>test</h1>');
      done();
    });
  });

  it('Should compile the template from a file path', function(done) {

    var path = 'spec/fixtures/template.html';
    var data = { title: 'test' };

    compiler.compilePath(path, data, function(err, result) {
      if (err) return done(err);
      expect(result.trim()).toBe('<h1>test</h1>');
      done();
    });
  });
});
