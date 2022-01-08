import chalk from 'chalk';
import Mustache from 'mustache';
import { FileReadWrite as File } from './filereadwrite.js';

/**
 * @typedef {Object} PackageOpts
 * @property {string} package_name - name of package
 * @property {string} out_dir - output directory
 * @property {string} [author] - Author
 * @property {string} [repository_url] - URL for package repo
 * @property {string} [typescript=false] - Typescript
 * @property {string} [docs=false] - Add typedocs for auto doc generation
 * @property {(npm|yarn|yarn2|pnpm)} package_manager - whether to use npm, yarn or, pnpm
 */

/**
 * 
 * @param {PackageOpts} opts 
 */
export async function create(opts) {
    validateOpts(opts);
    const filetype = opts.typescript ? 'ts' : 'js';
    await Promise.all([
        File.write(`${opts.out_dir}/package.json`, packageJSON(opts)),
        File.write(`${opts.out_dir}/README.md`, README(opts)),
        File.write(`${opts.out_dir}/index.${filetype}`, index(opts)),
        File.write(`${opts.out_dir}/index.test.${filetype}`, indextest(opts)),
    ]);
    console.log(`${chalk.green('✓')} Generated first package files`);
}

function validateOpts(opts) {
    if (!opts.package_name) throw new Error('Package name is required');
    if (!opts.out_dir) throw new Error('Output directory is required');

    // Defaults
    if(!opts.package_manager) opts.package_manager = 'npm';
    if(!opts.typescript) opts.typescript = false;
    if(!opts.docs) opts.docs = false;
}

/**
 * Render package json template
 * 
 * @private
 * @param {createOpts} opts
 * @returns {object}
 */
function packageJSON(opts, type = 'default') {
    const template = File.read(`./templates/${type}/package.json.mustache`, 'utf8');
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
    const template = File.read(`./templates/${type}/README.md.mustache`, 'utf8');
    return Mustache.render(template, opts);
}

/**
 * Render index entrypoint
 * 
 * @private
 * @param {createOpts} opts
 * @returns {object}
 */
function index(opts, type = 'default') {
    const template = File.read(`./templates/${type}/index.js.mustache`, 'utf8');
    return Mustache.render(template, opts);
}

/**
 * Render test for entrypoint
 * 
 * @private
 * @param {createOpts} opts
 * @returns {object}
 */
function indextest(opts, type = 'default') {
    const template = File.read(`./templates/${type}/index.test.js.mustache`, 'utf8');
    return Mustache.render(template, opts);
}
