'use strict';

var path = require('path');
var fs = require('fs-extra');
var async = require('async');
var dateFormat = require('dateformat');
var getSlug = require('speakingurl');
var dimsum = require('dimsum');

/**
 * scaffold module.
 */
var scaffold = module.exports = {};

/**
 * Copy a directory
 * @param  {String}   source The source directory.
 * @param  {String}   dest   The destination directory.
 * @param  {Function} done   Callback function.
 */
scaffold.copy = function(source, dest, done) {
  fs.copy(source, dest, function (err) {
    if (err) return done(err);
    done();
  });
};

/**
 * Remove a directory.
 * @param  {String}   source The source directory.
 * @param  {Function} done   Callback function.
 */
scaffold.remove = function(source, done) {
  fs.remove(path.resolve(source), function(err) {
    if (err) return done(err);
    done();
  });
};

/**
 * Create example posts with dummy data.
 * @param  {String}   dest Destination directory.
 * @param  {Number}   days The amount of posts to generate.
 * @param  {Function} done Callback function.
 */
scaffold.createPosts = function(dest, days, done) {
  var arr = [];
  while(days--) {
    arr.push(this.createPost.bind(this, dest, days));
  }
  async.parallel(arr, done);
};

/**
 * Create an example post with dummy data.
 * @param  {String}   dest Destination directory.
 * @param  {Number}   days The amount of days in the past from today.
 * @param  {Function} done Callback function.
 */
scaffold.createPost = function(dest, days, done) {
  this.savePost(this.getPost(dest, days), done);
};

/**
 * Get the post details.
 * @param  {String} dest Desination directory.
 * @param  {Number} days The amount of days in the past from today. Used for
 * generation the post date.
 * @return {Object}      The post data.
 */
scaffold.getPost = function(dest, days) {

  var date     = this.getPostDate(days);
  var title    = this.getPostTitle(date);
  var url      = this.getPostUrl(date, title);
  var contents = this.getPostContents(3);
  var filePath = this.getPostFilePath(dest, date, title);

  return {
    date: date,
    title: title,
    url: url,
    contents: contents,
    filePath: filePath
  };
};

/**
 * Save post to file.
 * @param  {Object}   post The post.
 * @param  {Function} done Callback function.
 */
scaffold.savePost = function(post, done) {
  fs.exists(post.filePath, function(exists) {
    if (!exists) {
      return fs.writeFile(post.filePath, post.contents, done);
    }
    done('File exists: ' + post.filePath);
  });
};

/**
 * Generate the post file path from the date and title.
 * @param  {String} dest      Destination directory.
 * @param  {Date} date      The post date.
 * @param  {String} title     The post title.
 * @param  {String} extension The file extension
 * @return {String}           The full file path.
 */
scaffold.getPostFilePath = function(dest, date, title, extension) {
  var fileName = this.getPostSlug(date, title) + '.' + (extension || 'md');
  return path.join(dest, fileName);
};

/**
 * Generates unformatted paragraphs of lipsum.
 * @param {Number} paragraph The amount of paragraphs to generate.
 * @return {String}
 */
scaffold.getPostContents = function(paragraphs) {
  return dimsum(paragraphs || 3);
};

/**
 * Generate the post date.
 * @param  {Number} days The amount of days in the past from today.
 * @return {Date}      The post date.
 */
scaffold.getPostDate = function(days) {
  var date = new Date();
  return date.setDate(date.getDate() - (days || 1));
};

/**
 * Generate post title from the date.
 * @param  {Date} date The post date.
 * @return {String}      The post title.
 */
scaffold.getPostTitle = function(date) {
  return 'Blog post for ' + dateFormat(date, 'dddd, mmmm dS, yyyy');
};

/**
 * Generate the post URL.
 * @param  {Date} date      The post date.
 * @param  {String} title     The post title.
 * @param  {String} extension The URL extension.
 * @return {String}           The post URL.
 */
scaffold.getPostUrl = function(date, title, extension) {
  return this.getPostSlug(date, title) + '.' + (extension || 'html');
};

/**
 * Generate the post slug
 * @param  {Date} date  The post date.
 * @param  {String} title The post title
 * @return {String}       The post slug.
 */
scaffold.getPostSlug = function(date, title) {
  return [
    dateFormat(date, 'yyyy-mm-dd'),
    getSlug(title)
  ].join('-');
};
