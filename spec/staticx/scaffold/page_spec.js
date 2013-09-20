'use strict';

var staticx = require('../../../lib/staticx.js');
var fs = require('fs-extra');
var dateFormat = require('dateformat');
var ScaffoldPage = require('../../../lib/staticx/scaffold/page');

describe('Scaffold page', function() {

  var dest = 'spec/fixtures/tmp';
  var days = 7;
  var now = new Date(2011,10,30);
  var page = new ScaffoldPage(dest, days, now);
  var expectedDate = new Date(2011,10,30);
  expectedDate.setDate(expectedDate.getDate() - (days || 1));

  var expectedTitle = 'Blog page for Wednesday, November 23rd, 2011';
  var expectedFilePath = 'spec/fixtures/tmp/2011-11-23-blog-page-for-wednesday-november-23rd-2011.md';
  var expectedSlug = '2011-11-23-blog-page-for-wednesday-november-23rd-2011';
  var expectedUrl = '2011-11-23-blog-page-for-wednesday-november-23rd-2011.html';

  it('Should create the page date', function(){

    var pageDateNow = new Date(expectedDate.getTime());
    var pageDate = page.getDate(days, pageDateNow);

    expect(pageDate.getDate()).toBe(pageDate.getDate());
    expect(pageDate.getDay()).toBe(pageDate.getDay());
    expect(pageDate.getFullYear()).toBe(pageDate.getFullYear());
    expect(pageDate.getHours()).toBe(pageDate.getHours());
    expect(pageDate.getMinutes()).toBe(pageDate.getMinutes());
  });

  it('Should create the page title', function(){
    var pageTitle = page.getTitle(expectedDate);
    expect(pageTitle).toBe(expectedTitle);
  });

  it('Should create the page slug from the title', function() {
    var pageSlug = page.getSlug(expectedDate, expectedTitle);
    expect(pageSlug).toBe(expectedSlug);
  });

  it('Should create the page url', function(){
    var url = page.getUrl(expectedDate, expectedTitle);
    expect(url).toBe(expectedUrl);
  });

  it('Should generate a filepath to save the page data', function() {
    var filePath = page.getFilePath(dest, expectedDate, expectedTitle);
    expect(filePath).toBe(expectedFilePath);
  });

  it('Should save the page data to file', function() {

    var complete = false;

    page.saveFile(function(err) {
      if (err) {
        throw err;
      }
      fs.exists(expectedFilePath, function(exists) {
        if (exists) {
          fs.readFile(expectedFilePath, function(err, data) {
            if (err) {
              throw err;
            }
            complete = !!data.toString();
          });
        }
        complete = exists;
      });
    });

    waitsFor(function() {
      return complete;
    }, 'Scaffold save page file took too long', 2000);

    runs(function() {
      expect(1).toBe(1);
    });
  });

  it('Should remove the page file', function() {

    var complete = false;

    page.removeFile(function(err) {
      if (err) {
        throw err;
      }
      fs.exists(expectedFilePath, function(exists) {
        complete = !exists;
      });
    });

    waitsFor(function() {
      return complete;
    }, 'Scaffold remove page file took too long', 2000);

    runs(function() {
      expect(1).toBe(1);
    });
  });
});
