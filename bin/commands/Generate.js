var path = require('path');
var fs = require('fs');
var _ = require('lodash');
var program = require('commander');
var util = require('util');
var Command = require('./Command');
var cliUtil = require('../util');

/**
 * Generate command.
 */
var GenerateCommand = module.exports = function() {
  program
  .command('generate')
  .description('Generate a site.')
  .option('--destination <destination>', 'destination path')
  .option('-i, --interactive', 'use prompts to set the options')
  .action(this.init.bind(this));

  Command.apply(this, arguments);
};

util.inherits(GenerateCommand, Command);

/**
 * Run the create command.
 * @param  {object} options The options object.
 */
GenerateCommand.prototype.run = function(options) {

  var start = new Date();
  var staticx = require('../../lib/staticx');

  staticx.generate.on('theme.build', function(theme) {
    console.log(util.format('* Building theme (%s)...', theme).data);
  });

  staticx.generate.on('theme.assetscopy', function() {
    console.log('* Publishing theme assets...'.data);
  });

  staticx.generate.on('theme.installdeps', function() {
    console.log('* Installing theme dependencies...'.data);
  });

  staticx.generate.on('pages.reading', function() {
    console.log('* Reading pages...'.data);
  });

  staticx.generate.on('pages.processing', function(pages) {
    console.log(util.format('* Processing %d pages...', pages.length).data);
  });

  staticx.generate({
    source: options.destination
  }, function(err, pages) {
    if (err) cliUtil.exit(1, err);

    var msg = [
      'Successfully generated a site at: %s',
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
GenerateCommand.prototype.getOptions = function(options, done) {

  var prompt = require('prompt');

  prompt.override = options;
  prompt.message = 'Generate';
  prompt.start();
  prompt.get([{
    name: 'destination',
    description: 'Destination path',
    type: 'string',
    required: true,
    message: 'Path does not exist',
    conform: fs.existsSync
  }], cliUtil.next(done));
};
