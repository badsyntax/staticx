'use strict';

var staticx = require('../../../lib/staticx.js');
var BaseModel = staticx.models.Base;
var Validator = require('schema-validator');

var schema = {
  date: {
    type: Date,
    required: false,
  },
  title: {
    type: String,
    required: true
  }
};

var TestModel = function() {
  this.setSchema(schema);
  BaseModel.apply(this, arguments);
};
require('util').inherits(TestModel, BaseModel);
TestModel.prototype.getFilePath = function() {
  return 'spec/fixtures/tmp';
};

describe('Base Model', function() {

  describe('Construction', function() {

    it('Should set the schema and default properties', function() {
      var model = new TestModel();
      expect(model.schema.date).toEqual(schema.date);
      expect(model.schema.title).toEqual(schema.title);
      expect(model.date).toBe(null);
    });

    it('Should set the filepath', function() {
      var model = new TestModel();
      expect(model.filePath).toBe('spec/fixtures/tmp');
    });

    it('Should create a new schema-validation object', function() {
      var model = new TestModel();
      expect(model.validator instanceof Validator).toBe(true);
    });

    it('Should set properties with a data object', function() {
      var model = new TestModel({
        foo: 'bar'
      });
      expect(model.foo).toBe('bar');
    });
  });

  it('Should return data for properties that match the schema', function() {
    var date = new Date();
    var title = 'test';
    var data = {
      foo: 'bar',
      title: title,
      date: date
    };
    var model = new TestModel(data);
    expect(model.getData()).toEqual({
      title: title,
      date: date
    });
  });

  it('Should validate the data against the schema rules', function() {
    var data = {
      title: 'test',
      date: 'Bla',
    };
    var model = new TestModel(data);
    var errors = model.validate();
    expect(typeof errors).toBe('object');
    expect(errors.date).not.toBe(undefined);
    expect(errors.date.type).not.toBe(undefined);
  });

  // it('Should save the ')

});
