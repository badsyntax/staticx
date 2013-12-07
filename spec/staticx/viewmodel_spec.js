/*
 * staticx
 * https://github.com/badsyntax/staticx
 *
 * Copyright (c) 2013 Richard Willis
 * Licensed under the MIT license.
 */
'use strict';

var fs = require('fs-extra');
var path = require('path');
var async = require('async');
var ViewModel = require('../../lib/staticx/ViewModel');
var FileStore = require('../../lib/staticx/stores/File');

describe('ViewModel', function() {

  var source = 'spec/fixtures/site';

  describe('Construction', function() {

    var model = new ViewModel(null, null, {
      title: 'bar'
    });

    it('Should set properties with a data object', function() {
      expect(model.title).toBe(undefined);
      expect(model.data.title).toBe('bar');
    });

    it('Should set the store', function() {
      expect(model.store instanceof FileStore).toBe(true);
    });

    describe('Factory', function() {
      it('Should return null if name and destination dirs aren\'t specified', function() {
        var VM = ViewModel.factory(null, null);
        expect(VM).toBe(null);
        VM = ViewModel.factory('test', null);
        expect(VM).toBe(null);
        VM = ViewModel.factory(null, 'test');
        expect(VM).toBe(null);
      });
      it('Should return a ViewModel instance', function() {
        var PageViewModel = require(path.resolve(path.join(source, '_source', 'viewModels', 'page')))(ViewModel);
        var VM = ViewModel.factory('page', source);
        expect(VM instanceof ViewModel).toBe(true);
        // Theme ViewModels return new Objects so we can do this instance check.
        // expect(VM instanceof PageViewModel).toBe(true);
      });
    });
  });

  describe('Rendering', function() {

    it('Should asynchronously render the HTML', function(done) {
      var model = ViewModel.factory('page', source, {
        title: 'bar'
      });
      model.render(function(err, html) {
        if (err) return done(err);
        expect(html.indexOf('<section class="page">')).not.toBe(-1);
        done();
      });
    });

    it('Should synchronously render the HTML', function() {
      var model = ViewModel.factory('page', source, {
        title: 'bar'
      });
      var html = model.renderSync();
      expect(html.indexOf('<section class="page">')).not.toBe(-1);
    });

    it('Should render the HTML with nested ViewModels', function(done) {
      var model = ViewModel.factory('page', source, {
        title: 'bar',
        body: ViewModel.factory('body', source)
      });
      model.render(function(err, html) {
        if (err) return done(err);
        expect(html.indexOf('<section class="page">')).not.toBe(-1);
        expect(html.indexOf('BODY')).not.toBe(-1);
        done();
      });
    });
  });

  describe('Saving', function() {
    it('Should save the rendered HTML to file', function(done) {
      var model = ViewModel.factory('page', source, {
        title: 'bar',
        body: ViewModel.factory('body', source)
      });
      var fileName = 'test.html';
      var filePath = path.join('spec/.tmp', fileName);
      model.render(function(err, modelHtml) {
        if (err) return done(err);
        model.save(filePath, function(err) {
          if (err) return done(err);
          fs.exists(filePath, function(exists) {
            expect(exists).toBe(true);
            fs.readFile(filePath, 'utf8', function(err, contents) {
              if (err) return done(err);
              expect(contents).toBe(modelHtml);
              fs.remove(filePath, done);
            });
          });
        });
      });
    });
  });
});
