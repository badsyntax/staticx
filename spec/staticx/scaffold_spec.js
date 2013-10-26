// 'use strict';

// var staticx = require('../../lib/staticx.js');
// var fs = require('fs-extra');
// var async = require('async');

// describe('Scaffolding', function() {

//   var createdPages = [];

//   it('Should remove a directory', function(){

//     var scaffold = staticx.scaffold;
//     var complete = false;

//     fs.mkdir('spec/fixtures/tmp/remove',function(err) {
//       if (err) {
//         console.error(err);
//       }
//       scaffold.remove('spec/fixtures/tmp/remove', function(err) {
//         if (err) throw err;
//         fs.exists('spec/fixtures/tmp/remove', function (exists) {
//           complete = !exists;
//         });
//       });
//     });

//     waitsFor(function() {
//       return complete;
//     }, 'Removing the directory took too long.', 1000);

//     runs(function () {
//       // If the test runs without timing out or erroring then it passed.
//       expect(1).toBe(1);
//     });
//   });

//   it('Should copy the skeleton files to a new directory', function(){

//     var scaffold = staticx.scaffold;
//     var source = 'skeleton';
//     var dest = 'spec/fixtures/tmp/skeleton';
//     var complete = false;

//     scaffold.copy(source, dest, function(err) {
//       if (err) {
//         throw err;
//       }
//       fs.exists(dest, function (exists) {
//         // Ensure the copied files are removed.
//         scaffold.clean(dest, function(err) {
//           if (err) throw err;
//           complete = exists;
//         });
//       });
//     });

//     waitsFor(function() {
//       return complete;
//     }, 'Copy the skeleton took too long.', 3000);

//     runs(function () {
//       // If the test runs without timing out or erroring then it passed.
//       expect(1).toBe(1);
//     });
//   });

//   it('Should create pages in markdown format', function() {

//     var scaffold = staticx.scaffold;
//     var complete = false;

//     scaffold.createPages({
//       destination: 'spec/fixtures/tmp',
//       days: 7
//     }, function(err, pages) {

//       if (err) {
//         throw err;
//       }

//       createdPages = pages;

//       // Here we check there's actually some content in the generated files.
//       async.series(pages.map(function(page) {
//         return function(done) {
//           fs.exists(page.filePath, function(exists) {
//             if (exists) {
//               fs.readFile(page.filePath, function(err, data) {
//                 if (err) {
//                   throw err;
//                 }
//                 if (!data.toString().trim()) {
//                   done('No data in file create scaffold page file.');
//                 } else {
//                   done(null);
//                 }
//               });
//             }
//           });
//         };
//       }), function(err) {
//         if (err) {
//           throw err;
//         }
//         complete = true;
//       });
//     });

//     waitsFor(function() {
//       return complete;
//     }, 'Creation of pages took too long.', 3000);

//     runs(function () {
//       // If the test runs without timing out or erroring then it passed.
//       expect(1).toBe(1);
//     });
//   });

//   it('Should remove all created pages', function() {

//     var scaffold = staticx.scaffold;
//     var complete = false;

//     // console.log(createdPages);

//     scaffold.removePages(createdPages, function(err) {
//       if (err) {
//         throw err;
//       }
//       complete = true;
//     });

//     waitsFor(function() {
//       return complete;
//     }, 'Removal of pages took too long.', 3000);

//     runs(function () {
//       // If the test runs without timing out or erroring then it passed.
//       expect(1).toBe(1);
//     });
//   });
// });
