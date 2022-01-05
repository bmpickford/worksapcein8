import { expect } from 'chai';
import create, { packageJSON, README } from '../create.js';

const MIN_OPTS = {
  package_name: 'create_test',
  license: 'MIT',
  workspace_type: 'npm',
  typescript: false,
  docs: false,
}

describe.only('create:e2e', function () {
  this.timeout(30000);
  it('npm', async function () {
    await create({ ...MIN_OPTS, workspace_type: 'npm' });
  })

  it('yarn1', async function () {
    await create({ ...MIN_OPTS, workspace_type: 'yarn' });
  })

  it.only('yarn2', async function () {
    await create({ ...MIN_OPTS, workspace_type: 'yarn2' });
  })

  it('pnpm', async function () {
    await create({ ...MIN_OPTS, workspace_type: 'pnpm' });
  })
});

describe('create', function () {
  describe('package.json', function () {
    describe('default', function () {
      it('creates defaults', function () {
        const out = JSON.parse(packageJSON(MIN_OPTS, 'default'));
        expect(out.main).to.equal('index.js');
        expect(out.module).to.equal('index.js');
        expect(out.type).to.equal('module');
        expect(out.types).to.equal('index.d.ts');
        expect(out.exports["."]["import"]).to.equal('./index.js');
      });

      it('creates a package.json with license', function () {    
        const out = JSON.parse(packageJSON(MIN_OPTS, 'default'));
        expect(out.license).to.equal('MIT');
      });
      
      it('creates a package.json name', function () {
        const out = JSON.parse(packageJSON(MIN_OPTS, 'default'));
        expect(out.name).to.equal('create_test');
      });
      
      it('creates a package.json name with scope', function () {
        const opts = {
          ...MIN_OPTS,
          scope: '@test',
        }
        const out = JSON.parse(packageJSON(opts, 'default'));
        expect(out.name).to.equal('@test/create_test');
        expect(out.author).to.equal('@test');
      });
    });

    describe('root', function () {
      it('creates a package.json with license', function () {    
        const out = JSON.parse(packageJSON(MIN_OPTS, 'default'));
        expect(out.license).to.equal('MIT');
      });
      
      it('creates a package.json name', function () {
        const out = JSON.parse(packageJSON(MIN_OPTS, 'default'));
        expect(out.name).to.equal('create_test');
      });
    });
  });

  describe('README', function () {
    it('creates readme', function () {
      const out = README(MIN_OPTS);
      expect(out.split('\n')[0]).to.equal('# create_test');
    });
  });
});