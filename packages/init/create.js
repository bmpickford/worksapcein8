import fs from 'fs';
import chalk from 'chalk';
import { PackageManager } from '@workspacein8/packagemanager';
import { create as createWorkspace } from '@workspacein8/workspace';
import { create as createPackage } from '@workspacein8/package';
import { execSync } from 'child_process';


/**
 * @typedef {Object} CreateOpts
 * @property {string} package_name - name of package
 * @property {string} workspace_name - name of workspace
 * @property {string} [scope] - scope of package
 * @property {string} [repository_url] - URL for package repo
 * @property {string} license - license
 * @property {(npm|yarn|pnpm)} workspace_type - whether to use npm or yarn workspaces
 * @property {boolean} type - use typescript
 * @property {boolean} docs - generate docs using typedoc
 * @property {boolean} [debug=false] - debug
 */

/**
 * Create new repo
 * 
 * @public
 * @param {CreateOpts} opts - Creation options
 * @returns {boolean}
 */
export default async function create(opts) {
    if (!opts.out_dir) throw new Error('Out directory not defined');
    if (!opts.workspace_name) throw new Error('Workspace name not defined');
    
    opts.out_dir = `${opts.out_dir}/${opts.workspace_name}`;
    if (fs.existsSync(opts.out_dir)) {
        console.error(`\n${chalk.red('Error:')} ${chalk.italic.yellow(opts.out_dir)} already exists. We don't want to override any important files so either rename the workspace or delete the folder to progress`);
        return;
    }

    PackageManager.cwd = opts.out_dir;
    PackageManager.debug = opts.debug || false;

    if (opts.debug) console.debug(`${chalk.blue('Your options: ')}${chalk.blue(JSON.stringify(opts, null, 2))}`);

    fs.mkdirSync(`${opts.out_dir}`);
    if (!fs.existsSync(`${opts.out_dir}/packages`)) fs.mkdirSync(`${opts.out_dir}/packages`);
    if (!fs.existsSync(`${opts.out_dir}/packages/${opts.package_name}`)) fs.mkdirSync(`${opts.out_dir}/packages/${opts.package_name}`);
    await Promise.all([
        createWorkspace(opts),
        createPackage({ ...opts, out_dir: `${opts.out_dir}/packages/${opts.package_name}`}),
    ]);
    try {
        execSync(`npx npx -p typescript tsc ${opts.out_dir}/packages/${opts.package_name}/index.js --declaration --emitDeclarationOnly --allowJs`);
        console.log(`${chalk.green('✓')} Created type definition`);
    } catch(error) {
        console.error(chalk.red(error));
    }

    addDeps(opts);
    addExample(opts);
}

/**
 * Adds needed dependencies
 * 
 * @param {CreateOpts} opts 
 */
function addDeps(opts) {
    if (opts.debug) console.log(chalk.blue('Installing dependencies...'));
    let out = PackageManager.run(opts.workspace_type).addDev('eslint vite jsdoc mocha chai');
    if (opts.typescript || opts.docs) {
        out += PackageManager.run(opts.workspace_type).addDev('typescript typedoc');
    }
    if (opts.debug) console.log(`${chalk.blue(out?.toString().trim())}`);
    console.log(`${chalk.green('✓')} Installed dependencies!`);
}

/**
 * Adds example
 * 
 * @param {CreateOpts} opts 
 */
function addExample(opts) {
    if (opts.debug) console.log(chalk.blue('Generating the example...'));
    const out = PackageManager.run(opts.workspace_type).init('vite example', '--template vanilla');
    if (opts.debug) console.log(`${chalk.blue(out.toString().trim())}`);
    console.log(`${chalk.green('✓')} Generated example!`);
}
