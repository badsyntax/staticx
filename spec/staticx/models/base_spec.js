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
    required: true,
    default: 'yes'
  }
};

var TestModel = function() {
  this.setSchema(schema);
  BaseModel.apply(this, arguments);
};
require('util').inherits(TestModel, BaseModel);

describe('Base Model', function() {

  describe('Schema', function() {

   it('Should set the schema and default properties', function() {
      var model = new TestModel();
      expect(model.schema.date).toEqual(schema.date);
      expect(model.schema.title).toEqual(schema.title);
      expect(model.date).toBe(null);
      expect(model.title).toBe('yes');
    });

    it('Should set properties with a data object', function() {
      var model = new TestModel({
        foo: 'bar'
      });
      expect(model.foo).toBe('bar');
    });
  });

  describe('Getting data', function() {
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

    it('Should return the data for a specified property that matches the schema', function() {
      var data = {
        title: 'bar',
      };
      var model = new TestModel(data);
      expect(model.getData('title')).toBe('bar');
    });
  });

  describe('Setting data', function() {

    it('Should set data using an object literal', function() {
      var data = {
        title: '',
        date: ''
      };
      var model = new TestModel(data);
      model.setData({
        title: 'foo'
      });
      expect(model.getData()).toEqual({
        title: 'foo',
        date: ''
      });
    });

    it('Should set data using an key and value', function() {
      var data = {
        title: '',
        date: ''
      };
      var model = new TestModel(data);
      model.setData('title', 'foo');
      expect(model.getData()).toEqual({
        title: 'foo',
        date: ''
      });
    });
  });

  describe('Validation', function() {
    it('Should create a new schema-validation object', function() {
      var model = new TestModel();
      expect(model.validator instanceof Validator).toBe(true);
    });
    it('Should validate the data against the schema rules', function() {
      var data = {
        title: 'test',
        date: 'Bla',
      };
      var model = new TestModel(data);
      var error = model.validate();
      expect(typeof error).toBe('object');
      expect(error.key).toBe('date');
      expect(error.message).not.toBe(undefined);
    });
  });
});
