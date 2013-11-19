'use strict';

var staticx = require('../../../lib/staticx');

describe('Reading pages', function() {

  var reader = staticx.readers.pages;

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
