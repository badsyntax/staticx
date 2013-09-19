'use strict';

var fs = require('fs-extra');
var path = require('path');
var dateFormat = require('dateformat');
var getSlug = require('speakingurl');
var dimsum = require('dimsum');

/**
 * A scaffold page model.
 * @param  {String} dest Desination directory.
 * @param  {Number} days The amount of days in the past from today. Used for
 * generation the page date.
 * @return {Object}      The page data.
 */
var Page = module.exports = function(dest, days) {
  this.date     = this.getPageDate(days);
  this.title    = this.getPageTitle(this.date);
  this.url      = this.getPageUrl(this.date, this.title);
  this.contents = this.getPageContents(3);
  this.filePath = this.getPageFilePath(dest, this.date, this.title);
};

/**
 * Save page to file.
 * @param  {Function} done Callback function.
 */
Page.prototype.save = function(done) {
  fs.exists(this.filePath, function(exists) {
    if (!exists) {
      return fs.writeFile(this.filePath, this.contents, done);
    }
    done('File exists: ' + this.filePath);
  }.bind(this));
};

/**
 * Generate the page file path from the date and title.
 * @param  {String} dest      Destination directory.
 * @param  {Date} date      The page date.
 * @param  {String} title     The page title.
 * @param  {String} extension The file extension
 * @return {String}           The full file path.
 */
Page.prototype.getPageFilePath = function(dest, date, title, extension) {
  var fileName = this.getPageSlug(date, title) + '.' + (extension || 'md');
  return path.join(dest, fileName);
};

/**
 * Generates unformatted paragraphs of lipsum.
 * @param {Number} paragraph The amount of paragraphs to generate.
 * @return {String}
 */
Page.prototype.getPageContents = function(paragraphs) {
  return dimsum(paragraphs || 3);
};

/**
 * Generate the page date.
 * @param  {Number} days The amount of days in the past from today.
 * @return {Date}      The page date.
 */
Page.prototype.getPageDate = function(days) {
  var date = new Date();
  return date.setDate(date.getDate() - (days || 1));
};

/**
 * Generate page title from the date.
 * @param  {Date} date The page date.
 * @return {String}      The page title.
 */
Page.prototype.getPageTitle = function(date) {
  return 'Blog page for ' + dateFormat(date, 'dddd, mmmm dS, yyyy');
};

/**
 * Generate the page URL.
 * @param  {Date} date      The page date.
 * @param  {String} title     The page title.
 * @param  {String} extension The URL extension.
 * @return {String}           The page URL.
 */
Page.prototype.getPageUrl = function(date, title, extension) {
  return this.getPageSlug(date, title) + '.' + (extension || 'html');
};

/**
 * Generate the page slug
 * @param  {Date} date  The page date.
 * @param  {String} title The page title
 * @return {String}       The page slug.
 */
Page.prototype.getPageSlug = function(date, title) {
  return [
    dateFormat(date, 'yyyy-mm-dd'),
    getSlug(title)
  ].join('-');
};