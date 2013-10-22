'use strict';

var staticx = require('../../../lib/staticx.js');
var Globalize = require('globalize');
var PageModel = staticx.models.Page;

var TestModel = function() {
  this.filePath = 'spec/fixtures/tmp';
  PageModel.apply(this, arguments);
};
require('util').inherits(TestModel, PageModel);

describe('Page Model', function() {

  describe('Construction', function() {

    it('Should set default properties', function() {
      var model = new TestModel({
        title: 'testing test 123',
        dateString: '1/2/2003'
      });
      expect(model.urlExtension).toBe('html');
      expect(model.fileExtension).toBe('md');
      expect(model.slug).toBe('2003-01-02-testing-test-123');
      expect(model.url).toBe('2003-01-02-testing-test-123.html');
      expect(model.filePath).toBe('spec/fixtures/tmp/2003-01-02-testing-test-123.md');
      expect(model.date.getTime()).toBe(Globalize.parseDate('1/2/2003').getTime());
    });
  });
});
