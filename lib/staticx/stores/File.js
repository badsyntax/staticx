var fs = require('fs-extra');

var FileStore = module.exports = function() {};

FileStore.prototype.getFileContent = function(done){
  done('');
};

FileStore.prototype.save = function(done) {
  this.getFileContent(function onGetFileContent(content) {
    // Using fs.outputFile, we ensure the directory exists before writing to file.
    fs.outputFile(this.filePath, content, done);
  }.bind(this));
};

/**
 * Delete from filesystem.
 * @param  {Function} done Callback function.
 */
FileStore.prototype.delete = function(done) {
  fs.unlink(this.filePath, done);
};
