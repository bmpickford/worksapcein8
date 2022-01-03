import prompts from 'prompts';
import create from './create';
import { validatePackageName, validateScope } from './validators/index';

const questions = [
    {
        type: 'text',
        name: 'package_name',
        message: 'Root package name?',
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
        initial: 'MIT',
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
    const response = await prompts([...questions, ...selections]);
    create(response);
})();
