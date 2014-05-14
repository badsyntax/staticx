var colors = require('colors');

colors.setTheme({
  error: 'red',
  info: 'green',
  data: 'grey',
  warning: 'yellow'
});

/**
 * Add colors to a string.
 * @param  {integer}  code      The exit code.
 * @param  {boolean}  substr    Is this a substitution string? (eg: 'Example %s')
 * @param  {string}   message   The message string to colorize.
 * @param  {integer}  index     The current array index.
 * @return {string}             The colorized string.
 */
function colorize(code, substr, message, index) {
  return !substr || index === 0 ? message[[
    'info',
    'error'
  ][code]] : message;
}

/**
 * Show a colorized log message and exit the process.
 * @param  {integer}  code      The exit code.
 * @param  {string}   message   The log message.
 */
exports.exit = function(code, message) {

  var args = [].slice.call(arguments, 1)
    .map(String.bind(null))
    .map(colorize.bind(null, code, /\%[sd]/.test(arguments[1])));

  console.log.apply(console, args);
  process.exit(code);
};

exports.next = function(done) {
  return function (err, result) {
    if (err) exports.exit(1, err);
    done(result);
  };
};
