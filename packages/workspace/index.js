import chalk from 'chalk';
import Mustache from 'mustache';
import { Commands } from '@workspacein8/packagemanager';
import { FileReadWrite as File } from './filereadwrite.js';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * @typedef {Object} WorkspaceOpts
 * @property {string} workspace_name - name of workspace
 * @property {string} out_dir - output directory
 * @property {string} [author] - Author
 * @property {string} [repository_url] - URL for package repo
 * @property {string} [license="MIT"] - license
 * @property {(npm|yarn|yarn2|pnpm)} workspace_type - whether to use npm, yarn or, pnpm workspaces
 */

/**
 * Creates the root workspace files
 * 
 * @param {WorkspaceOpts} opts
 * @returns {void}
 */
export async function create(opts) {
    validateOpts(opts);
    Commands.GetCommands(opts.workspace_type).workspaces.run('test');
    Commands.GetCommands(opts.workspace_type).workspaces.run('build');
    if (opts.workspace_type === 'yarn2') {
        opts.extra_commands = `\n\t\t"packageManager": "yarn@3.1.1",`
    }

    await Promise.all([
        File.write(`${opts.out_dir}/package.json`, packageJSON(opts)),
        File.write(`${opts.out_dir}/README.md`, README(opts)),
        File.write(`${opts.out_dir}/LICENSE`, File.read(`${__dirname}/licenses/${opts.license}.txt`)),
        File.write(`${opts.out_dir}/.editorconfig`, editorconfig(opts, 'default')),
        File.write(`${opts.out_dir}/.gitignore`, gitignore(opts, 'default')),
        File.write(`${opts.out_dir}/.eslintrc.js`, eslint(opts, 'default')),
    ]);
    console.log(`${chalk.green('✓')} Generated default files`);
}

function validateOpts(opts) {
    if (!opts.workspace_name) throw new Error('Workspace name is required');
    if (!opts.out_dir) throw new Error('Output directory is required');

    // Defaults
    if (!opts.license) opts.license = 'MIT';
    if (!opts.workspace_type) opts.workspace_type = 'npm';

    return;
}

/**
 * Render package json template
 * 
 * @private
 * @param {createOpts} opts
 * @returns {object}
 */
function packageJSON(opts, type = 'default') {
    const template = File.read(`${__dirname}/templates/${type}/package.json.mustache`, 'utf8');
    return Mustache.render(template, opts);
}

/**
 * Render README
 * 
 * @private
 * @param {createOpts} opts
 * @returns {object}
 */
function README(opts, type = 'default') {
    const template = File.read(`${__dirname}/templates/${type}/README.md.mustache`, 'utf8');
    return Mustache.render(template, opts);
}

/**
 * Render gitignore
 * 
 * @private
 * @param {createOpts} opts
 * @returns {object}
 */
function gitignore(opts, type = 'default') {
    const template = File.read(`${__dirname}/templates/${type}/.gitignore.mustache`, 'utf8');
    return Mustache.render(template, opts);
}

/**
 * Render editorconfig
 * 
 * @private
 * @param {createOpts} opts
 * @returns {object}
 */
function editorconfig(opts, type = 'default') {
    const template = File.read(`${__dirname}/templates/${type}/.editorconfig.mustache`, 'utf8');
    return Mustache.render(template, opts);
}


/**
 * Render eslint
 * 
 * @private
 * @param {createOpts} opts
 * @returns {object}
 */
 function eslint(opts, type = 'default') {
    const template = File.read(`${__dirname}/templates/${type}/.eslintrc.js.mustache`, 'utf8');
    return Mustache.render(template, opts);
}
