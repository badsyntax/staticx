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
      if (obj.length) {
        expect(obj[0].title).toBe('Site Blog');
        expect(obj[0].fileName).toBe('blog.md');
        expect(typeof obj[0].schema).toBe('object');
      }

      var page = {};
      obj.forEach(function(p) {
        if (p.filePath === 'spec/fixtures/site/_source/pages/blog/post.md') {
          page = p;
          return false;
        }
      });

      expect(page.filePath).toBe('spec/fixtures/site/_source/pages/blog/post.md');
      expect(page.parent).toBe('blog');
      done();
    });
  });
});
