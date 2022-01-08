import fs from 'fs';
import chalk from 'chalk';
import { PackageManager } from '@workspacein8/packagemanager';
import { create as createWorkspace } from '@workspacein8/workspace';
import { create as createPackage } from '@workspacein8/package';
import { execSync } from 'child_process';

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
    PackageManager.cwd = opts.out_dir;
    PackageManager.debug = true;
    if (!fs.existsSync(opts.out_dir)) fs.mkdirSync(opts.out_dir);
    if (!fs.existsSync(`${OUT_DIR}/packages`)) fs.mkdirSync(`${OUT_DIR}/packages`);
    if (!fs.existsSync(`${OUT_DIR}/packages/${opts.package_name}`)) fs.mkdirSync(`${OUT_DIR}/packages/${opts.package_name}`);
    await Promise.all([
        createWorkspace(opts),
        createPackage({ ...opts, out_dir: `${opts.out_dir}/packages/${opts.package_name}`}),
    ]);
    execSync(`npx npx -p typescript tsc ${opts.out_dir}/packages/${opts.package_name}/index.js --declaration --emitDeclarationOnly --allowJs`);

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
    let out = PackageManager.run(opts.workspace_type).addDev('eslint vite jsdoc mocha chai');
    if (opts.typescript || opts.docs) {
        out += PackageManager.run(opts.workspace_type).addDev('typescript typedoc');
    }
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
