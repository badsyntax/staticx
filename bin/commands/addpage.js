var fs = require('fs');
var path = require('path');
var _ = require('lodash');
var prompt = require('prompt');
var staticx = require('../../lib/staticx');
var validator = require('../../lib/staticx/validator');
var Command = require('./command');
var util = require('../util');

/**
 * Add page command
 */
module.exports = _.extend({}, Command, {
  action: function(options) {
    if (!options.interactive && !options.content) {
      process.stdin.resume();
      process.stdin.setEncoding('utf8');
      process.stdin.on('data', function(data) {
        options.content = data;
        this.run(options);
      }.bind(this));
    } else {
      this.run(options);
    }
  },
  run: function(options) {
    var start = new Date();

    staticx.init(options);

    staticx.addPage(options, function(err, page) {

      if (err) util.exit(1, err);

      var msg = [
        'Successfully created a new page at: %s',
        'Completed in %dms'.data
      ].join('\n');

      util.exit(0, msg, path.resolve(page.filePath), new Date() - start);
    });
  },
  getOptions: function(options, done) {

    var schema = staticx.models.Page.schema;
    var model = new staticx.models.Base();

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
            util.exit(1, 'Error: A valid config.json file does not exist at this path:', configPath);
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
      if (err) util.exit(1, err);
      done(_.merge(options, result));
    });
  }
});