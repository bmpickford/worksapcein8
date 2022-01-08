import Mustache from 'mustache';
import { FileReadWrite as File } from './filereadwrite.js';

const LICENSES = {
    'afl-3.0': 'licenses/AFL-3.0.txt',
    'apache-2.0': 'licenses/Apache-2.0.txt',
    // 'artistic-2.0': 'licenses/artistic-2.0.txt',
    'bsd-2-clause': 'licenses/BSD-2-Clause.txt',
    'bsd-3-clause-clear': 'licenses/BSD-3-Clause-Clear.txt',
    'bsd-3-clause': 'licenses/BSD-3-Clause.txt',
    'bsl-1.0': 'licenses/BSL-1.0.txt',
    // 'cc': 'licenses/cc.txt',
    'cc-by-4.0': 'licenses/CC-BY-4.0.txt',
    'cc-by-sa-4.0': 'licenses/CC-BY-SA-4.0.txt',
    'cc0-1.0': 'licenses/CC0-1.0.txt',
    'ecl-2.0': 'licenses/ECL-2.0.txt',
    'epl-1.0': 'licenses/EPL-1.0.txt',
    'epl-2.0': 'licenses/EPL-2.0.txt',
    'eupl-1.1': 'licenses/EUPL-1.1.txt',
    'agpl-3.0': 'licenses/AGPL-3.0.txt',
    'gpl': 'licenses/GPL-1.0-only.txt',
    'gpl-2.0': 'licenses/GPL-2.0-only.txt',
    'gpl-3.0': 'licenses/GPL-3.0-only.txt',
    'isc': 'licenses/ISC.txt',
    'lgpl': 'licenses/LGPL-2.0-only.txt',
    'lgpl-2.1': 'licenses/LGPL-2.1-only.txt',
    'lgpl-3.0': 'licenses/LGPL-3.0-only.txt',
    'lppl-1.3c': 'licenses/LPPL-1.3c.txt',
    'mit': 'licenses/MIT.txt',
    'mpl-2.0': 'licenses/MPL-2.0.txt',
    'ms-pl': 'licenses/MS-PL.txt',
    'ofl-1.1': 'licenses/OFL-1.1.txt',
    'osl-3.0': 'licenses/OSL-3.0.txt',
    'postgresql': 'licenses/PostgreSQL.txt',
    'ncsa': 'licenses/ncsa.txt',
    'unlicense': 'licenses/Unlicense.txt',
    'wtfpl': 'licenses/WTFPL.txt',
    'zlib': 'licenses/ZLIB.txt',
}

/**
 * @typedef {Object} BasePackageGeneratorOpts
 * @property {string} out_dir - output directory
 * @property {string} [author] - Author
 * @property {string} [repository_url] - URL for package repo
 * @property {string} [typescript=false] - Typescript
 * @property {string} [docs=false] - Add typedocs for auto doc generation
 * @property {string} [license="mit"] - License
 * @property {(npm|yarn|yarn2|pnpm)} package_manager - whether to use npm, yarn or, pnpm
 */

/**
 * Core package generator class used to render templates
 */
class CorePackageGenerator {
    /**
     * 
     * @param {BasePackageGeneratorOpts} opts 
     * @param {string} templateDir 
     */
    constructor(opts, templateDir) {
        this.opts = opts;
        this.templateDir = templateDir;

        if (!this.opts.package_manager) this.opts.package_manager = 'npm';
        if (!this.opts.typescript) this.opts.typescript = false;
        if (!this.opts.docs) this.opts.docs = false;
        if (!this.opts.license) opts.license = 'mit';

        this.validate();
    }

    /**
     * Validates the core options. Extend this
     */
    validate() {
        if (!this.opts.out_dir) {
            throw new Error('out_dir not supplied but is required');
        }
        if(!Object.keys(LICENSES).includes(this.opts.license.toLowerCase())) {
            throw new Error(`license is invalid. Supported licenses are: ${Object.keys(LICENSES).join(',')}`);
        }
    }

    /**
     * 
     * @param {string} file - File name. example: package.json 
     * @param {string} [type="default"] - Template type. Defined the subfolder to look in 
     * @returns {Object} - Rendered template
     */
    render(file, type = 'default') {
        const template = File.read(`${this.templateDir}/${type}/${file}.mustache`, 'utf8');
        return Mustache.render(template, this.opts);
    }

    /**
     * Generates the file from a templates and outputs the result
     * 
     * @param {string} infile - Input file from template
     * @param {string} [outfile] - File to output to. Will default to infile 
     */
    async generate(infile, outfile) {
        return File.write(`${this.opts.out_dir}/${outfile || infile}`, this.render(infile));
    }
}

export {
    File,
    CorePackageGenerator,
}