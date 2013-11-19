'use strict';

var staticx = require('../../../lib/staticx');

describe('Reading the site', function() {

  var reader = staticx.readers.site;

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
