'use strict';

module.exports = {
  options: {
    destination: 'docs/build',
    template: 'docs/template',
    tutorials: 'docs/src/tutorials',
    recurse: true,
    configure: 'docs/template/jsdoc.conf.json'
  },
  build : {
    src: [
      'lib/**/*.js'
    ]
  }
};
