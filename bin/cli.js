/*
 * staticx
 * https://github.com/badsyntax/staticx
 *
 * Copyright (c) 2013 Richard Willis
 * Licensed under the MIT license.
 */
'use strict';

/**
 * Load dependencies.
 */
var program = require('commander');
var pkg = require('../package.json');

/**
 * Load Commands.
 */
var AddPage = require('./commands/addpage');
var Create = require('./commands/create');

/**
 * Set the commands and options, and process the arguments.
 */
exports.init = function() {

  program.version(pkg.version);

  program
  .command('create')
  .description('create a new site')
  .option('--destination <destination>', 'destination path')
  .option('--posts <posts>', 'number of dummy blog posts to generate', parseInt)
  .option('--clean', 'clean the destination folder before creating')
  .option('-i, --interactive', 'use prompts to set the options')
  .action(Create.init.bind(Create));

  program
  .command('addpage')
  .description('add a new page')
  .option('--destination <destination>', 'destination path')
  .option('--title <title>', 'page title')
  .option('--parent <parent>', 'parent page')
  .option('--date <date>', 'page date')
  .option('--tags <tags>', 'page tags')
  .option('-i, --interactive', 'use prompts to set the options')
  .action(AddPage.init.bind(AddPage));

  program.parse(process.argv);
};
