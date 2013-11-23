/**
 * Our base command object.
 */
module.exports = {
  init:  function(command) {
    // var options = command.input;
    var options = command;
    if (options.interactive) {
      this.getOptions(options, this.action.bind(this));
    } else {
      this.action(options);
    }
  }
};
