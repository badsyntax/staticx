'use strict';

var staticx = require('../lib/staticx.js');
var fs = require('fs-extra');

describe('Generating HTML files', function() {

  describe('Compilers', function() {

    describe('Compiling markdown', function() {

      var compiler = staticx.compilers.markdown;

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

      var compiler = staticx.compilers.template;

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

  describe('Scaffolding', function() {

    it('Should remove a directory', function(){

      var scaffold = staticx.scaffold;
      var complete = false;

      fs.mkdir('spec/fixtures/tmp/remove',function(err) {
        if (err) {
          console.error(err);
        }
        scaffold.remove('spec/fixtures/tmp/remove', function(err) {
          if (err) throw err;
          fs.exists('spec/fixtures/tmp/remove', function (exists) {
            complete = !exists;
          });
        });
      });

      waitsFor(function() {
        return complete;
      }, 'Removing the directory took too long', 1000);

      runs(function () {
        // If the test runs without timing out or erroring then it passed.
        expect(1).toBe(1);
      });
    });

    it('Should copy the skeleton files to a new directory', function(){

      var scaffold = staticx.scaffold;
      var source = 'spec/fixtures/site_skeleton';
      var dest = 'spec/fixtures/tmp/site_skeleton';
      var complete = false;

      scaffold.copy(source, dest, function(err) {
        if (err) throw err;
        fs.exists(dest, function (exists) {
          scaffold.remove(dest, function(err) {
            if (err) throw err;
            complete = exists;
          });
        });
      });

      waitsFor(function() {
        return complete;
      }, 'Compilation took too long', 3000);

      runs(function () {
        // If the test runs without timing out or erroring then it passed.
        expect(1).toBe(1);
      });
    });
  });
});
