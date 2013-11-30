var fs = require('fs');
var util = require('util');
var path = require('path');
var _ = require('lodash');
var program = require('commander');
var Command = require('./Command');
var cliUtil = require('../util');
var staticx = require('../../lib/staticx');

/**
 * Add page command
 */
var AddPageCommand = module.exports = function() {

  program
  .command('addpage')
  .description('add a new page')
  .option('--destination <destination>', 'destination path')
  .option('--title <title>', 'page title')
  .option('--parent <parent>', 'parent page')
  .option('--date <date>', 'page date')
  .option('--tags <tags>', 'page tags')
  .option('-i, --interactive', 'use prompts to set the options')
  .action(this.init.bind(this));

  Command.apply(this, arguments);
};

util.inherits(AddPageCommand, Command);

/**
 * Run the Add page command.
 */
AddPageCommand.prototype.run = function(options) {
  this.getContentFromStdin(options, function() {
    var start = new Date();
    staticx.addPage(options, function(err, page) {
      if (err) cliUtil.exit(1, err);
      var msg = [
        'Successfully created a new page at: %s',
        'Completed in %dms'.data
      ].join('\n');
      cliUtil.exit(0, msg, path.resolve(page.filePath), new Date() - start);
    });
  });
};

AddPageCommand.prototype.getContentFromStdin = function(options, done) {
  if (options.interactive || options.content) return done();
  process.stdin.resume();
  process.stdin.setEncoding('utf8');
  process.stdin.on('data', function(data) {
    options.content = data;
    done();
  });
};

AddPageCommand.prototype.getOptions = function(options, done) {

  var prompt = require('prompt');
  var validator = require('../../lib/staticx/validator');
  var PageModel = require('../../lib/staticx/models/Page');
  var BaseModel = require('../../lib/staticx/models/Base');

  var schema = PageModel.schema;
  var model = new BaseModel();

  /** Begin the prompts */

  prompt.override = options;
  prompt.message = 'Add page';
  prompt.start();

  prompt.get([
    _.extend({}, schema.destination, {
      name: 'destination',
      description: 'Destination path',
      conform: function(destination) {
        if (!validator.fileExists(destination)) return false;
        options.destination = destination;
        var configPath = path.join(path.resolve(destination), 'config.json');
        if (!fs.existsSync(configPath)) {
          cliUtil.exit(1, 'Error: A valid config.json file does not exist at this path:', configPath);
        }
        return true;
      }
    }),
    _.extend({}, schema.parent, {
      name: 'parent',
      description: 'Parent page',
      conform: function(parent, obj) {
        var config = staticx.readers.site.getConfig(options.destination);
        return schema.parent.conform(parent, options.destination, config.fileExtension);
      }
    }),
    _.extend({}, schema.title, {
      name: 'title',
      description: 'Page title',
    }),
    _.extend({}, schema.date, {
      name: 'date',
      type: 'string',
      required: true,
      format: 'date-time',
      default: 'now',
      before: function(value) {
        return value === 'now' ? new Date().toISOString() : value;
      }
    }),
    _.extend({}, schema.tags, {
      name: 'tags',
      description: 'Page tags'
    }),
    _.extend({}, schema.content, {
      name: 'content',
      description: 'Page content'
    })
  ], function (err, result) {
    if (err) cliUtil.exit(1, err);
    done(_.merge(options, result));
  });
};
