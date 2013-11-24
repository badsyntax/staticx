/*
 * staticx
 * https://github.com/badsyntax/staticx
 *
 * Copyright (c) 2013 Richard Willis
 * Licensed under the MIT license.
 */
'use strict';

var reader = require('../../../lib/staticx/readers/site');

describe('Reading the site', function() {

  it('Should read and parse all site related data on the filesystem', function(done) {

    var parsed;
    var dir = 'lib/skeleton';

    reader.read(dir, function(err, obj) {
      if (err) return done(err);
      expect(typeof obj).toBe('object');
      expect(obj.pages).not.toBe(undefined);
      expect(typeof obj.config).toBe('object');
      done();
    });
  });
});
