/*
 * staticx
 * https://github.com/badsyntax/staticx
 *
 * Copyright (c) 2013 Richard Willis
 * Licensed under the MIT license.
 */
'use strict';

var reader = require('../../../lib/staticx/readers/pages');

describe('Reading pages', function() {

  it('Should read and parse page files', function(done) {

    var parsed;
    var dir = 'spec/fixtures/site';

    reader.read(dir, function(err, obj) {
      if (err) return done(err);
      expect(obj).not.toBe(undefined);
      expect(obj.length).toBe(3);
      expect(obj[0].title).toBe('Site Blog');
      expect(typeof obj[0].schema).toBe('object');
      done();
    });
  });
});
