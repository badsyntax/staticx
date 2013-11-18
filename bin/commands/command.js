/**
 * Our base command object.
 */
module.exports = {
  init:  function(command) {
    var options = command.input;
    if (options.interactive) {
      this.getOptions(options, this.action.bind(this));
    } else {
      this.action(options);
    }
  }
};
