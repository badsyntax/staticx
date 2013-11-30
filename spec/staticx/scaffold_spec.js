/*
 * staticx
 * https://github.com/badsyntax/staticx
 *
 * Copyright (c) 2013 Richard Willis
 * Licensed under the MIT license.
 */
'use strict';

var scaffold = require('../../lib/staticx/scaffold');
var fs = require('fs-extra');
var async = require('async');
var _ = require('lodash');

describe('Scaffolding', function() {

  it('Should remove a directory', function(done){
    fs.mkdir('spec/.tmp/remove',function(err) {
      if (err) return done(err);
      scaffold.remove('spec/.tmp/remove', function(err) {
        if (err) return done(err);
        fs.exists('spec/.tmp/remove', function (exists) {
          done(!exists ? null : 'Directory still exists');
        });
      });
    });
  });

  it('Should clean a directory', function(done){
    fs.mkdir('spec/.tmp/tmpclean', function(err) {
      if (err) return done(err);
      fs.writeFile('spec/.tmp/tmpclean/file', 'Hello', function(err) {
        if (err) return done(err);
        expect(fs.existsSync('spec/.tmp/tmpclean/file')).toBe(true);
        scaffold.clean('spec/.tmp/tmpclean', function() {
          expect(fs.existsSync('spec/.tmp/tmpclean')).toBe(true);
          expect(fs.existsSync('spec/.tmp/tmpclean/file')).toBe(false);
          fs.remove('spec/.tmp/tmpclean', done);
        });
      });
    });
  });

  it('Should copy the skeleton files to a new directory', function(done){

    var source = 'lib/skeleton';
    var dest = 'spec/.tmp/skeleton';

    fs.mkdir(dest, function(err) {
      if (err) return done(err);
      scaffold.copy(source, dest, function(err) {
        if (err) return done(err);
        fs.exists(dest, function (exists) {
          if (!exists) return done('The destination folder does not exists: ' + dest);
          scaffold.clean(dest, function(err) {
            if (err) return done(err);
            fs.remove(dest, done);
          });
        });
      });
    });
  });

  var createdPosts = [];

  it('Should create posts in markdown format', function(done) {

    function checkPostExists(page) {
      return function(next) {
        fs.exists(page.filePath, function(exists) {
          if (!exists) return next('Page does not exist on filesystem: ' + page.filePath);
          fs.readFile(page.filePath, function(err, data) {
            if (err) return done(err);
            if (!data.toString().trim()) {
              next('No data in file create scaffold page file.');
            } else {
              next(null);
            }
          });
        });
      };
    }

    function onCreatePosts(err, posts) {
      if (err) return done(err);
      // Expose the created posts so we can use them in other tests.
      createdPosts = posts;
      // Here we check there's actually some content in the generated files...
      async.parallel(posts.map(checkPostExists), done);
    }

    scaffold.createPosts({
      destination: 'spec/.tmp',
      posts: 7
    }, onCreatePosts);
  });

  it('Should remove an array of created pages', function(done) {
    scaffold.removePages(createdPosts, function(err) {
      if (err) return done(err);
      async.forEach(createdPosts, function(post, callback) {
        fs.exists(post.filePath, function(exists) {
          if (exists) return done('Created page still exist on the filesystem: ' + post.filePath);
          callback();
        });
      }, done);
    });
  });

  it('Should create a new skeleton site with optional blog posts', function(done) {

    var options = {
      source: 'lib/skeleton',
      destination: 'spec/.tmp/create',
      posts: '10',
      clean: 'y',
      makeParentDirs: true
    };

    spyOn(scaffold, 'copy').andCallThrough();
    spyOn(scaffold, 'createPosts').andCallThrough();
    spyOn(scaffold, 'clean').andCallThrough();

    scaffold.create(options, function(err) {
      if (err) return done(err);
      // Check that scaffold.copy was called.
      expect(scaffold.copy).toHaveBeenCalled();
      expect(scaffold.copy.mostRecentCall.args[0]).toEqual('lib/skeleton');
      expect(scaffold.copy.mostRecentCall.args[1]).toEqual(options.destination);
      // Check that scaffold.createPosts was called.
      expect(scaffold.createPosts).toHaveBeenCalled();
      expect(scaffold.createPosts.mostRecentCall.args[0]).toEqual(
        _.extend({}, options, {
          destination: 'spec/.tmp/create/_source/_pages/blog',
          source : 'lib/skeleton'
        })
      );
      // Check that scaffold.clean was called.
      expect(scaffold.clean).toHaveBeenCalled();
      // Remove tmp dir.
      fs.remove(options.destination, done);
    });
  });
});
