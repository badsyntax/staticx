'use strict';

var staticx = require('../lib/staticx.js');

describe('Generating HTML files', function() {

  describe('Compiler', function() {

    it('Should merge options with default options', function() {
      var options = {
        opt1: true
      };
      var defaultOptions = {
        opt1: false,
        opt2: false
      };
      var compiler = new staticx.Compiler(defaultOptions, options);
      expect(compiler.options).toEqual({
        opt1: true,
        opt2: false
      });
    });

    describe('Compiling markdown', function() {

      var compiler = new staticx.Compiler.Markdown({});

      it('Should compile markdown from a string of text.', function() {

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

      it('Should compile markdown from a file path.', function() {

        var path = 'spec/fixtures/markdown_file_path.md';
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

    describe('Compiling templates', function() {

      var compiler = new staticx.Compiler.Template({});

      it('Should compile the template from a string of text', function() {

        var template = '<h1>{{title}}</h1>';
        var data = { title: 'test' };
        var compiled;

        compiler.compile(template, data, function(err, data) {
          if (err) throw err;
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

        var path = 'spec/fixtures/template_file_path.hbs';
        var data = { title: 'test' };
        var compiled;

        compiler.compilePath(path, data, function(err, data) {
          if (err) throw err;
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
  });
});
