'use strict';

var staticx = require('../../lib/staticx.js');
var fs = require('fs-extra');
var async = require('async');

describe('Scaffolding', function() {

  it('Should remove a directory', function(done){
    fs.mkdir('spec/fixtures/tmp/remove',function(err) {
      if (err) throw err;
      staticx.scaffold.remove('spec/fixtures/tmp/remove', function(err) {
        if (err) throw err;
        fs.exists('spec/fixtures/tmp/remove', function (exists) {
          done(!exists ? null : 'Directory still exists');
        });
      });
    });
  });

  it('Should copy the skeleton files to a new directory', function(done){

    var scaffold = staticx.scaffold;
    var source = 'skeleton';
    var dest = 'spec/fixtures/tmp/skeleton';

    scaffold.copy(source, dest, function(err) {
      if (err) throw err;
      fs.exists(dest, function (exists) {
        if (!exists) return done('The destination folder does not exists: ' + dest);
        scaffold.clean(dest, done);
      });
    });
  });

  var createdPosts = [];

  it('Should create posts in markdown format', function(done) {

    var scaffold = staticx.scaffold;

    function checkPostExists(page) {
      return function(next) {
        fs.exists(page.filePath, function(exists) {
          if (!exists) return next('Page does not exist on filesystem: ' + page.filePath);
          fs.readFile(page.filePath, function(err, data) {
            if (err) throw err;
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
      if (err) throw err;
      // Expose the created posts so we can use them in other tests.
      createdPosts = posts;
      // Here we check there's actually some content in the generated files...
      async.series(posts.map(checkPostExists), done);
    }

    scaffold.createPosts({
      destination: 'spec/fixtures/tmp',
      posts: 7
    }, onCreatePosts);
  });

  it('Should remove an array of created pages', function(done) {
    staticx.scaffold.removePages(createdPosts, function(err) {
      if (err) throw err;
      async.forEach(createdPosts, function(post, callback) {
        fs.exists(post.filePath, function(exists) {
          if (exists) return done('Created page still exist on the filesystem: ' + post.filePath);
          callback();
        });
      }, done);
    });
  });
});
