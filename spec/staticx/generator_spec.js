/*
 * staticx
 * https://github.com/badsyntax/staticx
 *
 * Copyright (c) 2013 Richard Willis
 * Licensed under the MIT license.
 */
'use strict';

var async = require('async');
var generator = require('../../lib/staticx/generator');
var scaffold = require('../../lib/staticx/scaffold');

describe('Generator', function() {

  it('Should validate the source and destination directories', function(done){
    generator.generate({
      source: '.',
      destination: 'notfound'
    }, function(err) {
      expect(err).not.toBe(null);
      generator.generate({
        source: 'notfound',
        destination: '.'
      }, function(err) {
        expect(err).not.toBe(null);
        done();
      });
    });
  });

  it('Should read and parse the source site', function(done) {

    var source = 'spec/fixtures/tmp/source';
    var destination = 'spec/fixtures/tmp/destination';

    var options = {
      destination: source,
      posts: '20',
      clean: 'y',
      makeParentDirs: true
    };

    scaffold.create(options, function(err) {
      if (err) return done(err);
      generator.generate({
        source: source,
        destination: destination,
        makeParentDirs: true
      }, function(err, obj) {
        if (err) return done(err);
        expect(typeof obj).toBe('object');
        expect(obj.length).not.toBe(undefined);
        expect(obj.length).toBeGreaterThan(0);
        done(null);
      });
    });
  });
});
