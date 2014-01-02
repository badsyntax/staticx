'use strict';

module.exports = {
  pkg: require('./package.json'),
  build: function(options, config, pages, done) {
    console.log('BUILDING The THEME');
    done(null);
  }
};
