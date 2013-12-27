/*
 * staticx
 * https://github.com/badsyntax/staticx
 *
 * Copyright (c) 2013 Richard Willis
 * Licensed under the MIT license.
 */
'use strict';

var fs = require('fs-extra');
var dateFormat = require('dateformat');
var ScaffoldPage = require('../../../lib/staticx/models/Page/Scaffold');

describe('Scaffold page', function() {

  it('Should create the default page date', function(){

    var page = new ScaffoldPage();

    var expectedDate = new Date();

    var expectedYear = expectedDate.getFullYear();
    var expectedMonth = expectedDate.getMonth()+1;
    var expectedDay = expectedDate.getDate();

    var pageDateNow = new Date(expectedDate.getTime());
    var pageDate = page.date;

    expect(pageDate instanceof Date).toBe(true);
    expect(pageDate.getDate()).toBe(expectedDate.getDate());
    expect(pageDate.getDay()).toBe(expectedDate.getDay());
    expect(pageDate.getFullYear()).toBe(expectedDate.getFullYear());
    expect(pageDate.getHours()).toBe(expectedDate.getHours());
    expect(pageDate.getMinutes()).toBe(expectedDate.getMinutes());
  });

  it('Should create the page title', function(){
    var page = new ScaffoldPage({
      date: new Date(2013,11,10)
    });
    expect(page.title).toBe('Blog page for Tuesday, December 10th, 2013');
  });

  it('Should create the page slug from the title', function() {
    var page = new ScaffoldPage({
      date: new Date(2013,11,10)
    });
    expect(page.slug).toBe('blog-page-for-tuesday-december-10th-2013');
  });

  it('Should create the page url', function(){
    var page = new ScaffoldPage({
      date: new Date(2013,11,10)
    }, {
      urlFormat: ':year-:month-:day-:slug.:urlExtension'
    });
    expect(page.url).toBe('2013-12-10-blog-page-for-tuesday-december-10th-2013.html');
  });

  it('Should generate a filepath to save the page data', function() {
    var page = new ScaffoldPage({
      date: new Date(2013,11,10),
      destination: 'spec/.tmp/pages'
    });
    expect(page.filePath).toBe('spec/.tmp/pages/blog-page-for-tuesday-december-10th-2013.md');
  });
});
