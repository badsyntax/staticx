'use strict';

var staticx = require('../../../lib/staticx.js');
var fs = require('fs-extra');

describe('Compiling templates', function() {

  var compiler = staticx.compilers.template;

  it('Should compile the template from a string of text', function() {

    var template = '<h1>{{title}}</h1>';
    var data = { title: 'test' };
    var compiled;

    compiler.compile(template, data, function(err, data) {
      expect(err).toBe(null);
      compiled = data;
    });

    waitsFor(function() {
      return compiled !== undefined;
    }, 'Compilation took too long', 5000);

    runs(function () {
      expect(compiled.trim()).toBe('<h1>test</h1>');
    });
  });

  it('Should compile the template from a file path', function() {

    var path = 'spec/fixtures/template.html';
    var data = { title: 'test' };
    var compiled;

    compiler.compilePath(path, data, function(err, data) {
      expect(err).toBe(null);
      compiled = data;
    });

    waitsFor(function() {
      return compiled !== undefined;
    }, 'Compilation took too long', 5000);

    runs(function () {
      expect(compiled.trim()).toBe('<h1>test</h1>');
    });
  });
});
