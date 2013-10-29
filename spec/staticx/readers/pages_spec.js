'use strict';

var staticx = require('../../../lib/staticx');

describe('Reading pages', function() {

  var reader = staticx.readers.pages;

  it('Should read and parse page files', function() {

    var parsed;
    var dir = 'spec/fixtures/_pages';

    reader.read(dir, function(err, obj) {
      if (err) throw err;
      parsed = obj;
    });

    waitsFor(function() {
      return parsed !== undefined;
    }, 'Parsing took too long', 1000);

    runs(function(){
      expect(parsed).not.toBe(undefined);
      expect(parsed.length).toBe(3);
      expect(parsed[0].title).toBe('Site Blog');
      expect(typeof parsed[0].schema).toBe('object');
    });
  });
});
