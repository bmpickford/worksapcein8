import Mustache from 'mustache';
import fs from 'fs';

/**
 * @typedef {Object} createOpts
 * @property {string} package_name - name of package
 * @property {string} [scope] - scope of package
 * @property {string} [repository_url] - URL for package repo
 * @property {string} license - license
 * @property {(npm | yarn)} workspace_type - whether to use npm or yarn workspaces
 * @property {boolean} typescript - use typescript
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
    return Promise.all([
        asyncWriteFile('./package.json.out', packageJSON(opts)),
    ]);
}

/**
 * Render package json template
 * 
 * @private
 * @param {createOpts} opts
 * @returns {object}
 */
export function packageJSON(opts) {
    const template = fs.readFileSync('./templates/default/package.json.mustache', 'utf8');
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