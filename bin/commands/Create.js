var path = require('path');
var fs = require('fs');
var _ = require('lodash');
var program = require('commander');
var util = require('util');
var Command = require('./Command');
var cliUtil = require('../util');

/**
 * Create command.
 */
var CreateCommand = module.exports = function() {

  program
  .command('create')
  .description('Create a new site.')
  .option('--destination <destination>', 'destination path')
  .option('--posts <posts>', 'number of dummy blog posts to generate', parseInt)
  .option('--clean', 'clean the destination folder before creating')
  .option('-i, --interactive', 'use prompts to set the options')
  .action(this.init.bind(this));

  Command.apply(this, arguments);
};

util.inherits(CreateCommand, Command);

/**
 * Run the create command.
 * @param  {object} options The options object.
 */
CreateCommand.prototype.run = function(options) {

  if (!fs.existsSync(options.destination)) {
    console.log(
      'Warning: Destination path does not exist, will attempt to create it.'.warning
    )
    try {
      fs.mkdirSync(options.destination);
    } catch(e) {
      console.log(
        util.format('Error: Unable to create destination directory: %s', e.message).error
      );
      return;
    }
  }

  var start = new Date();
  var staticx = require('../../lib/staticx');

  options = _.pick(options, 'destination', 'posts');

  var cwd = path.dirname(fs.realpathSync(__filename));
  options.source = path.resolve(cwd, '..', '..', 'lib', 'skeleton');

  staticx.create(options, function(err) {
    if (err) cliUtil.exit(1, err);

    var msg = [
      'Successfully created a new site at: %s',
      'Completed in %dms'.data
    ].join('\n');

    cliUtil.exit(0, msg, path.resolve(options.destination), new Date() - start);
  });
};
/**
 * Prompt the user for various options.
 * @param  {Function} done The callback function to run once all options have
 * been gathered.
 */
CreateCommand.prototype.getOptions = function(options, done) {

  var prompt = require('prompt');

  prompt.override = options;
  prompt.message = 'Create';
  prompt.start();
  prompt.get([{
    name: 'destination',
    description: 'Destination path',
    type: 'string',
    required: true,
    message: 'Path does not exist',
  }, {
    name: 'posts',
    description: 'Number of posts',
    type: 'string',
    pattern: /^\w+$/,
    default: '0',
    required: true
  }, {
    name: 'clean',
    description: 'Clean the directory first? (y/n)',
    type: 'string',
    pattern: /^[yn]$/i,
    message: 'Please enter either \'y\' or \'n\'',
    default: 'n',
    required: true
  }], cliUtil.next(done));
};
