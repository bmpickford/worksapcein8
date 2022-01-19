#!/usr/bin/env bash
":" //# comment; exec /usr/bin/env node --input-type=module - "$@" < "$0"
import prompts from 'prompts';
import create from './create.js';
import { validatePackageName, validateScope } from './validators/index.js';
import yargs from 'yargs';

const argv = yargs(process.argv.slice(2))
    .usage('Usage: $0 <command> [options]')
    .command('create', 'create a new workspace')
    .boolean(['debug', 'defaults'])
    .describe('debug', 'Add debugging statements')
    .describe('defaults', 'Select defaults')
    .describe('workspace_name', 'Name of workspace')
    .alias('w', 'workspace_name')
    .nargs('w', 1)
    .describe('out', 'Output dir')
    .alias('o', 'out')
    .nargs('o', 1)
    .describe('package', 'Only create a single package instead of a workspace')
    .alias('p', 'package')
    .nargs('p', 1)
    .example('$0 create', 'Start interactive creation')
    .example('$0 create -w my_workspace', 'Start creation with workspace name already set')
    .example('$0 create --defaults', 'Create with all default values')
    .example('$0 create -o ./my_other_folder', 'Create at a different output location')
    .example('$0 create -p my_package', 'Create single package called my_package instead of whole workspace')
    .help('help')
    .alias('h', 'help')
    .argv;

prompts.override(argv);

const DEFAULTS = {
    workspace_name: 'my_workspace',
    package_name: 'first_package',
    scope: '@myorg',
    license: 'mit',
    workspace_type: 'npm',
}

const questions = [
    {
        type: 'text',
        name: 'workspace_name',
        message: 'Workspace name?',
        validate: validatePackageName,
    },
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
    }
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
        inactive: 'no'
    },
    {
        type: 'toggle',
        name: 'docs',
        message: 'Include automated docs (tsdoc)?',
        initial: false,
        active: 'yes',
        inactive: 'no'
    }
];

(async () => {
    const onCancel = () => {
        throw new Error('Aborted')
    }

    if (argv.package) {
        console.error('Not yet implemented');
        return;
    }


    const promptResponses = argv.defaults ? DEFAULTS : await prompts([...questions, ...selections], { onCancel })
    const responses = {
        ...promptResponses,
        package_name: promptResponses.package_name || 'first_package',
        debug: argv.debug,
        out_dir: argv.out || '.'
    }

    create(responses);
})();
