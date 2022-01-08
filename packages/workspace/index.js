import chalk from 'chalk';
import { Commands } from '@workspacein8/packagemanager';
import { CorePackageGenerator } from '@workspacein8/core';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * @typedef {Object} WorkspaceOptsType
 * @property {string} workspace_name - name of workspace
 */


/**
 * @typedef {import('@workspacein8/core').BasePackageGeneratorOpts & WorkspaceOptsType} WorkspaceOpts
 */


 class WorkspaceGenerator extends CorePackageGenerator {
    constructor(opts) {
        super(opts, `${__dirname}/templates`);
    }

    validate() {
        if (!this.opts.workspace_name) throw new Error('Workspace name is required');
    }
}

/**
 * Creates the root workspace files
 * 
 * @param {WorkspaceOpts} opts
 * @returns {void}
 */
export async function create(opts) {
    const workspace = new WorkspaceGenerator(opts);
    Commands.GetCommands(opts.workspace_type).workspaces.run('test');
    Commands.GetCommands(opts.workspace_type).workspaces.run('build');
    if (opts.workspace_type === 'yarn2') {
        opts.extra_commands = `\n\t\t"packageManager": "yarn@3.1.1",`
    }

    await Promise.all([
        workspace.generate('package.json'),
        workspace.generate('README.md'),
        workspace.generate('LICENSE'),
        workspace.generate('.editorconfig'),
        workspace.generate('.gitignore'),
        workspace.generate('.eslintrc.js'),
    ]);
    console.log(`${chalk.green('✓')} Generated default files`);
}
