import chalk from 'chalk';
import { CorePackageGenerator } from '@workspacein8/core';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { PackageManager } from '@workspacein8/packagemanager';
import { readFileSync, writeFileSync } from 'fs';

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
    pkg.generate('index.js', `index.${filetype}`),
    pkg.generate('index.test.js', `index.test.${filetype}`),
  ]);
  console.log(`${chalk.green('✓')} Generated first package files`);
}

/**
 *
 * @param {PackageOpts} opts
 * @param {string} [type="button"]
 */
export async function createComponent(
  opts,
  framework = 'react',
  type = 'button'
) {
  const pkg = new PackageGenerator(opts);
  sbInit(opts, framework);

  const filetype = opts.typescript ? 'ts' : 'js';
  await Promise.all([
    pkg.generate('package.json', 'package.json', `${framework}/common/`),
    pkg.generate('README.md'),
    pkg.generate(
      'index.jsx',
      `index.${filetype}x`,
      `${framework}/components/${type}`
    ),
    pkg.generate(
      'index.stories.jsx',
      `index.stories.${filetype}x`,
      `${framework}/components/${type}`
    ),
    pkg.generate(
      'index.module.css',
      'index.module.css',
      `${framework}/components/${type}`
    ),
  ]);
  console.log(`${chalk.green('✓')} Generated ${type} files`);
}

function sbInit(opts, framework = 'react') {
  console.log('Generating storybook, this may take a couple minutes..');
  PackageManager.run(opts.workspace_type).exec(`npx sb init --yes --type ${framework} --builder webpack5 --skip-install`);
  PackageManager.run(opts.workspace_type).exec(`npx rimraf stories`);
  
  const sbFile = `${opts.out_dir}/../../.storybook/main.js`;
  const mainjs = readFileSync(sbFile, 'utf8');
  const out = mainjs.replace(/stories\//g, '');
  writeFileSync(sbFile, out, 'utf8');

  console.log(`${chalk.green('✓')} Added storybook`);
}