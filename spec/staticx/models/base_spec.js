/*
 * staticx
 * https://github.com/badsyntax/staticx
 *
 * Copyright (c) 2013 Richard Willis
 * Licensed under the MIT license.
 */
'use strict';

var BaseModel = require('../../../lib/staticx/models/Base');

var schema = {
  date: {
    type: 'string',
    required: false,
    format: 'date-time'
  },
  title: {
    type: 'string',
    required: true,
    default: 'yes'
  }
};

var TestModel = function() {
  this.setSchema(schema);
  this.filePath = 'spec/.tmp/tmpPage';
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
        title: 'bar'
      });
      expect(model.title).toBe('bar');
    });
  });

  describe('Getting data', function() {
    it('Should return data for properties that match the schema', function() {
      var date = new Date().toISOString();
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
    it('Should validate the data against the schema rules', function() {
      var data = {
        title: 'test',
        date: 'Bla',
      };
      var model = new TestModel(data);
      var validate = model.validate();
      expect(typeof validate).toBe('object');
      expect(validate.valid).toBe(false);
      expect(validate.errors instanceof Array).toBe(true);
      expect(validate.errors[0].property).toBe('date');
    });
  });
});
