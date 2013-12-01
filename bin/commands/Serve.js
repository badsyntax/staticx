var path = require('path');
var fs = require('fs');
var _ = require('lodash');
var program = require('commander');
var util = require('util');
var Command = require('./Command');
var cliUtil = require('../util');

/**
 * Serve command.
 */
var ServeCommad = module.exports = function() {

  program
  .command('serve')
  .description('Start a web server for a site.')
  .option('--destination <destination>', 'destination path')
  .option('--port <port>', 'port', parseInt)
  .option('-i, --interactive', 'use prompts to set the options')
  .action(this.init.bind(this));

  Command.apply(this, arguments);
};

util.inherits(ServeCommad, Command);

/**
 * Run the create command.
 * @param  {object} options The options object.
 */
ServeCommad.prototype.run = function(options) {

  options = _.merge(_.pick(options, 'destination', 'port'), {
    port: options.port || 3000
  });

  var connect = require('connect');
  var http = require('http');

  var app = connect()
    .use(connect.favicon())
    .use(connect.static(options.destination))
    .use(connect.directory(options.destination))
    .use(function(req, res){
      res.end('Hello from Connect!\n');
    });

  http.createServer(app).listen(options.port);

  console.log(util.format('Server running on port %d'.green, options.port));
};

/**
 * Prompt the user for various options.
 * @param  {Function} done The callback function to run once all options have
 * been gathered.
 */
ServeCommad.prototype.getOptions = function(options, done) {

  var prompt = require('prompt');

  prompt.override = options;
  prompt.message = 'Serve';
  prompt.start();
  prompt.get([{
    name: 'destination',
    description: 'Destination path',
    type: 'string',
    required: true,
    default: '.',
    message: 'Path does not exist',
    conform: function(value) {
      return fs.existsSync(value);
    }
  }, {
    name: 'port',
    description: 'Port',
    type: 'string',
    required: true,
    message: 'Invalid input',
    default: 3000,
    conform: function(value) {
      return !isNaN(parseInt(value, 10));
    }
  }], function (err, result) {
    if (err) cliUtil.exit(1, err);
    done(result);
  });
};
