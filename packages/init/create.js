import Mustache from 'mustache';
import fs from 'fs';
import chalk from 'chalk';
import { PackageManager } from './src/packageManager/index.js';
import { GetCommands } from './src/packageManager/commands/index.js';

const OUT_DIR = '../../out';

/**
 * @typedef {Object} createOpts
 * @property {string} package_name - name of package
 * @property {string} [scope] - scope of package
 * @property {string} [repository_url] - URL for package repo
 * @property {string} license - license
 * @property {(npm | yarn)} workspace_type - whether to use npm or yarn workspaces
 * @property {boolean} type - use typescript
 * @property {boolean} docs - generate docs using typedoc
 */

/**
 * Create new repo
 * 
 * @public
 * @param {createOpts} opts - Creation options
 * @returns {boolean}
 */
export default async function create(opts) {
    PackageManager.cwd = OUT_DIR;
    PackageManager.debug = true;
    if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR);
    if (!fs.existsSync(`${OUT_DIR}/packages`)) fs.mkdirSync(`${OUT_DIR}/packages`);
    await Promise.all([
        createRootFiles(opts),
        createWorkspaceFiles(opts)
    ]);
    
    addDeps(opts);
    addExample(opts);
}

/**
 * Adds needed dependencies
 * 
 * @param {createOpts} opts 
 */
function addDeps(opts) {
    console.log(chalk.blue('Installing dependencies...'));
    const out = PackageManager.run(opts.workspace_type).addDev('eslint typescript vite jsdoc');
    console.log(`${chalk.blue(out?.toString().trim())}`);
    console.log(`${chalk.green('✓')} Done!`);
}

/**
 * Adds example
 * 
 * @param {createOpts} opts 
 */
function addExample(opts) {
    console.log(chalk.blue('Generating the example...'));
    const out = PackageManager.run(opts.workspace_type).init('vite example', '--template vanilla');
    console.log(`${chalk.blue(out.toString().trim())}`);
    console.log(`${chalk.green('✓')} Done!`);
}

async function createRootFiles(opts) {
    GetCommands(opts.workspace_type).workspaces.run('test');
    GetCommands(opts.workspace_type).workspaces.run('build');
    if (opts.workspace_type === 'yarn') {
        opts.extra_commands = `"packageManager": "yarn@3.1.1"`
    }

    await Promise.all([
        asyncWriteFile(`${OUT_DIR}/package.json`, packageJSON(opts)),
        asyncWriteFile(`${OUT_DIR}/README.md`, README(opts)),
        asyncWriteFile(`${OUT_DIR}/LICENSE`, fs.readFileSync(`./licenses/${opts.license}.txt`)),
    ]);
    console.log(`${chalk.green('✓')} Generated root files`);
}

async function createWorkspaceFiles(opts) {
    const _opts = { ...opts, package_name: 'my_first_package' };
    if (!fs.existsSync(`${OUT_DIR}/packages/${_opts.package_name}`)) fs.mkdirSync(`${OUT_DIR}/packages/${_opts.package_name}`);
    await Promise.all([
        asyncWriteFile(`${OUT_DIR}/packages/${_opts.package_name}/package.json`, packageJSON(_opts, 'default')),
        asyncWriteFile(`${OUT_DIR}/packages/${_opts.package_name}/README.md`, README(_opts, 'default')),
        asyncWriteFile(`${OUT_DIR}/packages/${_opts.package_name}/index.js`, indexjs(_opts, 'default')),
    ]);
    console.log(`${chalk.green('✓')} Generated first package files`);
}

/**
 * Render package json template
 * 
 * @private
 * @param {createOpts} opts
 * @returns {object}
 */
export function packageJSON(opts, type = 'root') {
    const template = fs.readFileSync(`./templates/${type}/package.json.mustache`, 'utf8');
    return Mustache.render(template, opts);
}

/**
 * Render README
 * 
 * @private
 * @param {createOpts} opts
 * @returns {object}
 */
export function README(opts, type = 'root') {
    const template = fs.readFileSync(`./templates/${type}/README.md.mustache`, 'utf8');
    return Mustache.render(template, opts);
}

/**
 * Render index.js entrypoint
 * 
 * @private
 * @param {createOpts} opts
 * @returns {object}
 */
export function indexjs(opts, type = 'root') {
    const template = fs.readFileSync(`./templates/${type}/index.js.mustache`, 'utf8');
    return Mustache.render(template, opts);
}

function asyncWriteFile(file, data) {
    return new Promise((resolve, reject) => {
        fs.writeFile(file, data, 'utf8', (err) => {
            if (err) reject(err);
            else resolve('');
        });
    });
}