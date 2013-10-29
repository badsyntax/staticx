'use strict';

var staticx = require('../../../lib/staticx');

describe('Reading the site', function() {

  var reader = staticx.readers.site;

  it('Should read and parse all site related data on the filesystem', function() {

    var parsed;
    var dir = 'skeleton';

    reader.read(dir, function(err, obj) {
      if (err) throw err;
      parsed = obj;
    });

    waitsFor(function() {
      return parsed !== undefined;
    }, 'Site parsing took too long', 1000);

    runs(function(){
      expect(typeof parsed).toBe('object');
      expect(parsed.pages).not.toBe(undefined);
      expect(typeof parsed.config).toBe('object');
    });
  });
});
