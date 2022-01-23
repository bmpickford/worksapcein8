#!/usr/bin/env node
import prompts from 'prompts';
import create from './create.js';
import { validateScope } from './validators/index.js';
import yargs from 'yargs';

const argv = yargs(process.argv.slice(2))
  .usage('Usage: <command> [options]')
  .scriptName('@workspacein8/init')
  .command('<workspace_name>', 'Generate a workspace')
  .demandCommand(1, 'You need to specify a name for the workspace')
  .boolean(['debug', 'y'])
  .describe('debug', 'Add debugging statements')
  .describe('y', 'Preselect all defaults')
  .option('out', {
    describe: 'Out directory',
    alias: 'o',
    nargs: 1,
    default: '.',
  })
  .option('template', {
    describe: 'Use premade template',
    choices: ['node', 'components'],
    alias: 't',
    default: 'node',
    nargs: 1,
  })
  .option('framework', {
    describe: 'Use specific framework. "none" will use plain HTML',
    choices: ['none', 'react', 'lit'],
    alias: 'f',
    default: 'none',
    nargs: 1,
  })
  .example('$0 <workspace_name>', 'Start interactive creation')
  .example('$0 <workspace_name> -y', 'Accept all defaults')
  .example(
    '$0 <workspace_name> --template components',
    'Create component library'
  )
  .example(
    '$0 <workspace_name> --template components --framework react',
    'Create a React component library'
  )
  .example(
    '$0 <workspace_name> -o ./my_sub_directory',
    'Create at  different directory'
  )
  .help('help')
  .alias('h', 'help')
  .wrap(Math.min(120, yargs.windowWidth)).argv;

prompts.override(argv);

const DEFAULTS = {
  package_name: 'first_package',
  scope: '@myorg',
  license: 'mit',
  workspace_type: 'npm',
};

const questions = [
  {
    type: 'text',
    name: 'scope',
    message: 'Scope [optional]',
    validate: validateScope,
  },
  {
    type: 'text',
    name: 'repository_url',
    message: 'Repository URL [optional]',
  },
  {
    type: 'text',
    name: 'license',
    message: 'license [optional]',
    initial: 'mit',
  },
];

const selections = [
  {
    type: 'select',
    name: 'workspace_type',
    message: 'Workspace type',
    choices: [
      { title: 'NPM', value: 'npm' },
      { title: 'Yarn', value: 'yarn' },
      { title: 'PNPM', value: 'pnpm' },
    ],
  },
  {
    type: 'toggle',
    name: 'typescript',
    message: 'Typescript?',
    initial: false,
    active: 'yes',
    inactive: 'no',
  },
  {
    type: 'toggle',
    name: 'docs',
    message: 'Include automated docs (tsdoc)?',
    initial: false,
    active: 'yes',
    inactive: 'no',
  },
];

(async () => {
  const onCancel = () => {
    throw new Error('Aborted');
  };

  if (argv.package) {
    console.error('Not yet implemented');
    return;
  }

  const workspace_name = argv._[0];

  const promptResponses = argv.y
    ? DEFAULTS
    : await prompts([...questions, ...selections], { onCancel });
  const responses = {
    ...promptResponses,
    workspace_name,
    package_name: promptResponses.package_name || 'first_package',
    debug: argv.debug,
    out_dir: argv.out || '.',
    template_type: argv.template,
    framework: argv.framework,
  };

  create(responses);
})();
