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

    // NOTE: there's a lot we're not testing here, like the existence of
    // files on the filesystem, or if certain methods are called, because those
    // types of tests are done within the various module specs.

    var source = 'spec/.tmp/source';

    scaffold.create({
      destination: source,
      source: 'lib/skeleton',
      posts: '20',
      clean: 'y',
      makeParentDirs: true
    }, function(err) {
      done();
      if (err) return done(err);
      generator.generate({
        source: source
      }, function(err, pages) {
        if (err) return done(err);
        // Check that the pages have been read and parsed correctly.
        expect(typeof pages).toBe('object');
        expect(pages.length).not.toBe(undefined);
        expect(pages.length).toBeGreaterThan(0);
        expect(!!pages[0].generatedFilePath).toBe(true);
        // Check the blog page has been generated in the correct directory.
        fs.exists(path.join(source, 'blog.html'), function(exists) {
          expect(exists).toBe(true);
          fs.remove(source, done);
        });
      });
    });
  });
});
