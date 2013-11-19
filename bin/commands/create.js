var path = require('path');
var fs = require('fs');
var _ = require('lodash');
var prompt = require('prompt');
var Command = require('./command');
var util = require('../util');
var staticx = require('../../lib/staticx');

/**
 * Create command object.
 */
module.exports = _.extend({}, Command, {
  /**
   * Run the create action.
   * @param  {object} options The options object.
   */
  action: function(options) {
    var start = new Date();

    options.source = '../lib/skeleton';

    staticx.create(options, function(err) {
      if (err) util.exit(1, err);

      var msg = [
        'Successfully created a new site at: %s',
        'Completed in %dms'.data
      ].join('\n');

      util.exit(0, msg, path.resolve(options.destination), new Date() - start);
    });
  },
  /**
   * Prompt the user for various options.
   * @param  {Function} done The callback function to run once all options have
   * been gathered.
   */
  getOptions: function(options, done) {
    prompt.override = options;
    prompt.message = 'Create';
    prompt.start();
    prompt.get([{
      name: 'destination',
      description: 'Destination path',
      type: 'string',
      required: true,
      message: 'Path does not exist',
      conform: function(value) {
        return fs.existsSync(value);
      }
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
    }], function (err, result) {
      if (err) util.exit(1, err);
      done(result);
    });
  }
});
