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

  var date = new Date(2011,10,30);
  date.setDate(date.getDate() - (days || 1));

  var title = 'Blog page for Wednesday, November 23rd, 2011';

  it('Should create the page date', function(){
    var pageDateNow = new Date(date.getTime());
    var pageDate = page.getPageDate(days, pageDateNow);
    expect(pageDate.getDate()).toBe(pageDate.getDate());
    expect(pageDate.getDay()).toBe(pageDate.getDay());
    expect(pageDate.getFullYear()).toBe(pageDate.getFullYear());
    expect(pageDate.getHours()).toBe(pageDate.getHours());
    expect(pageDate.getMinutes()).toBe(pageDate.getMinutes());
  });

  it('Should create the page title', function(){
    var pageTitle = page.getPageTitle(date);
    expect(pageTitle).toBe(title);
  });

  it('Should create the page slug from the title', function() {
    var pageSlug = page.getPageSlug(date, title);
    expect(pageSlug).toBe('2011-11-23-blog-page-for-wednesday-november-23rd-2011');
  });

  it('Should create the page url', function(){
    var url = page.getPageUrl(date, title);
    expect(url).toBe('2011-11-23-blog-page-for-wednesday-november-23rd-2011.html');
  });

  it('Should generate a filepath to save the page data', function() {
    var filePath = page.getPageFilePath(dest, date, title);
    expect(filePath).toBe('spec/fixtures/tmp/2011-11-23-blog-page-for-wednesday-november-23rd-2011.md');
  });
});
