'use strict';

var fs = require('fs');
var staticx = require('../../../lib/staticx.js');
var Globalize = require('globalize');
var PageModel = staticx.models.Page;
var markdownParser = staticx.parsers.markdown;

var TestModel = function() {
  this.filePath = 'spec/fixtures/tmp';
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
      expect(model.slug).toBe('2013-11-03-example-title');
      expect(model.url).toBe('2013-11-03-example-title.html');
      expect(model.filePath).toBe('spec/fixtures/tmp/2013-11-03-example-title.md');
      expect(model.date.getTime()).toBe(date.getTime());
    });
  });

  it('Save the page data to file', function() {

    var complete = false;

    model.save(function(err) {
      if (err) throw err;
      markdownParser.parseFile(model.filePath, function(err, data) {
        if (err) throw err;
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

  it('Removes the page file', function() {
    var complete = false;

    model.delete(function(err) {
      if (err) throw err;
      fs.exists(model.filePath, function(exists) {
        complete = !exists;
      });
    });

    waitsFor(function() {
      return complete;
    }, 'Deleting page model took too long', 2000);

    runs(function() {
      expect(1).toBe(1);
    });
  });
});
