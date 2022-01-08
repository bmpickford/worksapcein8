import create from '../create.js';

const MIN_OPTS = {
  package_name: 'create_test',
  workspace_name: 'create_test_workspace',
  license: 'MIT',
  workspace_type: 'npm',
  typescript: false,
  docs: false,
  out_dir: '../../out'
}

describe.only('create:e2e', function () {
  this.timeout(30000);
  it.only('npm', async function () {
    await create({ ...MIN_OPTS, workspace_type: 'npm' });
  })

  it('yarn1', async function () {
    await create({ ...MIN_OPTS, workspace_type: 'yarn' });
  })

  it('yarn2', async function () {
    await create({ ...MIN_OPTS, workspace_type: 'yarn2' });
  })

  it('pnpm', async function () {
    await create({ ...MIN_OPTS, workspace_type: 'pnpm' });
  })
});
