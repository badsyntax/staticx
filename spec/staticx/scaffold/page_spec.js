// 'use strict';

// var fs = require('fs-extra');
// var dateFormat = require('dateformat');
// var staticx = require('../../../lib/staticx.js');
// var ScaffoldPage = require('../../../lib/staticx/models/page/scaffold');

// describe('Scaffold page', function() {

//   var dest = 'spec/fixtures/tmp';
//   var days = 7;
//   var now = new Date(2011,10,30);
//   var options = {
//     destination: dest,
//     days: days,
//     now: now
//   };
//   var page = new ScaffoldPage(options);

//   var expectedDate = new Date(2011,10,30);
//   expectedDate.setDate(expectedDate.getDate() - (days || 0));

//   var expectedTitle = 'Blog page for Wednesday, November 23rd, 2011';
//   var expectedFilePath = 'spec/fixtures/tmp/2011-11-23-blog-page-for-wednesday-november-23rd-2011.md';
//   var expectedSlug = '2011-11-23-blog-page-for-wednesday-november-23rd-2011';
//   var expectedUrl = '2011-11-23-blog-page-for-wednesday-november-23rd-2011.html';

//   it('Should create the page date', function(){

//     var pageDateNow = new Date(expectedDate.getTime());
//     var pageDate = page.date;

//     expect(pageDate instanceof Date).toBe(true);
//     expect(pageDate.getDate()).toBe(expectedDate.getDate());
//     expect(pageDate.getDay()).toBe(expectedDate.getDay());
//     expect(pageDate.getFullYear()).toBe(expectedDate.getFullYear());
//     expect(pageDate.getHours()).toBe(expectedDate.getHours());
//     expect(pageDate.getMinutes()).toBe(expectedDate.getMinutes());
//   });

//   it('Should create the page title', function(){
//     var pageTitle = page.title;
//     expect(pageTitle).toBe(expectedTitle);
//   });

//   it('Should create the page slug from the title', function() {
//     var pageSlug = page.slug;
//     expect(pageSlug).toBe(expectedSlug);
//   });

//   it('Should create the page url', function(){
//     var url = page.url;
//     expect(url).toBe(expectedUrl);
//   });

//   it('Should generate a filepath to save the page data', function() {
//     var filePath = page.filePath;
//     expect(filePath).toBe(expectedFilePath);
//   });
// });
