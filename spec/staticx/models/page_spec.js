'use strict';

var fs = require('fs');
var path = require('path');
var async = require('async');
var staticx = require('../../../lib/staticx.js');
var Globalize = require('globalize');
var PageModel = staticx.models.Page;
var markdownParser = staticx.parsers.markdown;

var TestModel = function() {
  this.destination = 'spec/fixtures/tmp';
  PageModel.apply(this, arguments);
};
require('util').inherits(TestModel, PageModel);

describe('Page Model', function() {

  var date = new Date('2013', '10', '3');

  var model = new TestModel({
    title: 'Example title',
    content: '*This is some test content.*',
    date: date
  });

  describe('Construction', function() {

    it('Should set default properties', function() {
      expect(model.urlExtension).toBe('html');
      expect(model.fileExtension).toBe('md');
      expect(model.slug).toBe('example-title');
      expect(model.url).toBe('example-title.html');
      expect(model.filePath).toBe('spec/fixtures/tmp/_pages/example-title.md');
      expect(model.date.getTime()).toBe(date.getTime());
    });
  });

  it('Save the page data to file', function() {

    var complete = false;

    model.save(function(err, data) {
      if (err) throw err;
      expect(data).toBe(model);
      markdownParser.parseFile(model.filePath, function(err, data) {
        expect(err).toBe(null);
        complete = data;
      });
    });

    waitsFor(function() {
      return complete;
    }, 'Saving page model took too long', 2000);

    runs(function() {
      expect(complete.metadata.title).toBe('Example title');
      expect(complete.markdown).toBe('*This is some test content.*');
    });
  });

  it('Removes the page file', function(done) {
    model.delete(function(err) {
      expect(err).toBe(null);
      fs.exists(model.filePath, function(exists) {
        done(!exists ? null : 'Page still exists on filesystem');
      });
    });
  });

  it('Should validate the parent page correctly', function(done) {

    // Check that an invalid parent page is validated.
    var model1 = new TestModel({
      title: 'test',
      date: new Date().toISOString(),
      parent: 'doesnotexist'
    });
    var validate = model1.validate();
    expect(validate.valid).toBe(false);
    expect(validate.errors instanceof Array).toBe(true);
    expect(validate.errors[0].property).toBe('parent');

    // Create the parent page.
    new TestModel({
      title: 'test hello',
      date: new Date(),
    }).save(function(err, parentModel) {
      expect(err).toBe(null);

      // Check the valid parent page passes validation.
      var model2 = new TestModel({
        title: 'test',
        date: new Date().toISOString(),
        parent: path.basename(parentModel.filePath, '.' + parentModel.fileExtension)
      });
      var error2 = model2.validate();
      expect(error2.valid).toBe(true);
      parentModel.delete(done);
    });
  });

  it('Should save the page data to file when specifying the parent page', function(done) {
    // Create the first level page.
    new TestModel({
      title: 'first level',
      date: new Date(),
    }).save(function(err, firstModel) {
      expect(err).toBe(null);

      var parent = path.basename(firstModel.filePath, '.' + firstModel.fileExtension);

      // Create the second level page.
      new TestModel({
        title: 'second level',
        date: new Date(),
        parent: parent
      }).save(function(err, secondModel) {
        expect(err).toBe(null);

        var parent = [
          secondModel.parent || '',
          path.basename(secondModel.filePath, '.' + secondModel.fileExtension)
        ].join('/');

        var page = new TestModel({
          title: 'third level',
          date: new Date().toISOString(),
          parent: parent
        });

        page.save(function(err) {
          expect(err).toBe(null);
          fs.exists(path.join(secondModel.destination, '_pages', parent), function(exists) {
            if (!exists) return done('Parent page directory does not exist');
            fs.exists(page.filePath, function(exists) {
              if (!exists) return done('Page not saved to file');
              async.series([
                firstModel.delete.bind(firstModel),
                secondModel.delete.bind(secondModel),
                page.delete.bind(page)
              ], function(err) {
                expect(err).toBe(null);

                /** TODO */
                // We should check that empty directories are removed.

                done(err);
              });
            });
          });
        });
      });
    });
  });
});
