import chalk from 'chalk';
import { CorePackageGenerator } from '@workspacein8/core';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * @typedef {Object} PackageOptsType
 * @property {string} package_name - name of package
 */


/**
 * @typedef {import('@workspacein8/core').BasePackageGeneratorOpts & PackageOptsType} PackageOpts
 */


 class PackageGenerator extends CorePackageGenerator {
    constructor(opts) {
        super(opts, `${__dirname}/templates`);
    }

    validate() {
        if (!this.opts.package_name) throw new Error('Package name is required');
    }
}


/**
 * 
 * @param {PackageOpts} opts 
 */
export async function create(opts) {
    const pkg = new PackageGenerator(opts);
    
    const filetype = opts.typescript ? 'ts' : 'js';
    await Promise.all([
        pkg.generate('package.json'),
        pkg.generate('README.md'),
        pkg.generate('index.js',`index.${filetype}`),
        pkg.generate('index.test.js', `index.test.${filetype}`),
    ]);
    console.log(`${chalk.green('✓')} Generated first package files`);
}

