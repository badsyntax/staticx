/*
 * staticx
 * https://github.com/badsyntax/staticx
 *
 * Copyright (c) 2013 Richard Willis
 * Licensed under the MIT license.
 */

var path = require('path');
var async = require('async');
var fs = require('fs');
var spawn = require('child_process').spawn;
var pkg = require('../../package.json');
var binPath = path.resolve('bin/staticx');
var staticx = require('../../lib/staticx');

function test(args, stdout) {
  return function(callback) {
    var process = spawn(binPath, args);
    process.stdout.on('data', stdout);
    process.on('exit', function(code) {
      callback(code === 0 ? null : 'Process exited with code ' + code);
    });
  };
}

describe('Bin', function() {

  it('Should show the package version', function(done) {
    function runTests(data) {
      expect(data.toString().trim()).toEqual(pkg.version);
    }
    async.parallel([
      test(['V'], runTests),
      test(['--version'], runTests)
    ], done);
  });

  it('Should show the usage instructions', function(done) {
    function runTests(data) {
      expect(data.toString().trim().length).toBeGreaterThan(0);
    }
    async.parallel([
      test(['-h'], runTests),
      test(['--help'], runTests)
    ], done);
  });

  describe('Create command', function() {
    it('Should show the usage instructions', function(done) {
      function runTests(data) {
        expect(data.toString().trim().length).toBeGreaterThan(0);
      }
      async.parallel([
        test(['create','-h'], runTests),
        test(['create','--help'], runTests)
      ], done);
    });
    it('Should create a base site', function() {
      // var options = {
      //   destination: 'spec/fixtures/tmp/create2',
      //   posts: '10',
      //   clean: 'y'
      // };
      // spyOn(staticx, 'create').andCallThrough();
      // // CHECK the staticx.create command was called with the expected data.
      // function runTests() {
      //   // expect(staticx.create).toHaveBeenCalled();
      // }
      // var args1 = ['create'];
      // args1.push('--destination');
      // args1.push(options.destination);
      // args1.push('--posts');
      // args1.push(options.posts);
      // args1.push('--clean');

      // fs.mkdir(options.destination, function(err) {
      //   if (err) return done(err);
      //   async.parallel([
      //     test(args1, runTests)
      //   ], function(err) {
      //     if (err) return done(err);
      //     console.log('REMOVE');
      //     fs.remove(options.destination, done);
      //   });
      // });
    });
  });

  describe('Add page command', function() {
    it('Should show the usage instructions', function(done) {
      function runTests(data) {
        expect(data.toString().trim().length).toBeGreaterThan(0);
      }
      async.parallel([
        test(['addpage','-h'], runTests),
        test(['addpage','--help'], runTests)
      ], done);
    });
  });
});
