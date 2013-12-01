/**
 * Our base command object.
 */
var Command = module.exports = function() {};

/**
 * Init method is called after the arguments has been parsed.
 * @param  {Object} options The commander.js argument options.
 */
Command.prototype.init = function(options) {
  if (options.interactive) {
    this.getOptions(options, this.run);
  } else {
    this.run(options);
  }
};
