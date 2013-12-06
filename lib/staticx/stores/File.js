var fs = require('fs-extra');

var FileStore = module.exports = function(filePath) {
  this.filePath = filePath;
  if (!this.filePath)
    throw new Error('File store: invalid file path.');
};

/**
 * Save content to file.
 * @param  {String}   content The content to save to file.
 * @param  {Function} done    Callback function.
 */
FileStore.prototype.save = function(content, done) {
  /* Using fs.outputFile, we ensure the directory exists before writing to file. */
  fs.outputFile(this.filePath, content, done);
};

/**
 * Delete the file from filesystem.
 * @param  {Function} done Callback function.
 */
FileStore.prototype.delete = function(done) {
  fs.unlink(this.filePath, done);
};
