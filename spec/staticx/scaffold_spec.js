'use strict';

var staticx = require('../../lib/staticx.js');
var fs = require('fs-extra');

describe('Scaffolding', function() {

  it('Should remove a directory', function(){

    var scaffold = staticx.scaffold;
    var complete = false;

    fs.mkdir('spec/fixtures/tmp/remove',function(err) {
      if (err) {
        console.error(err);
      }
      scaffold.remove('spec/fixtures/tmp/remove', function(err) {
        if (err) throw err;
        fs.exists('spec/fixtures/tmp/remove', function (exists) {
          complete = !exists;
        });
      });
    });

    waitsFor(function() {
      return complete;
    }, 'Removing the directory took too long', 1000);

    runs(function () {
      // If the test runs without timing out or erroring then it passed.
      expect(1).toBe(1);
    });
  });

  it('Should copy the skeleton files to a new directory', function(){

    var scaffold = staticx.scaffold;
    var source = 'spec/fixtures/site_skeleton';
    var dest = 'spec/fixtures/tmp/site_skeleton';
    var complete = false;

    scaffold.copy(source, dest, function(err) {
      if (err) throw err;
      fs.exists(dest, function (exists) {
        scaffold.remove(dest, function(err) {
          if (err) throw err;
          complete = exists;
        });
      });
    });

    waitsFor(function() {
      return complete;
    }, 'Compilation took too long', 3000);

    runs(function () {
      // If the test runs without timing out or erroring then it passed.
      expect(1).toBe(1);
    });
  });

  it('Should create pages in markdown format', function() {

    var scaffold = staticx.scaffold;

    scaffold.createPages('spec/fixtures/tmp', 7, function(err) {
      if (err) {
        throw err;
      }
    });
  });
});
