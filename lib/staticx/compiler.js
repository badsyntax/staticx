'use strict';

/**
 * A compiler factory.
 * @param  {String} compiler The compiler name.
 * @return {Compiler}        The compiler class.
 */
module.exports = function(compiler) {

  if (compiler === undefined) {
    throw 'Please specified the compiler type.';
  }

  return require('./compiler/' + compiler);
};