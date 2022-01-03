import { expect } from 'chai';
import { packageJSON } from '../create.js';

const MIN_OPTS = {
  package_name: 'create_test',
  license: 'MIT',
  workspace_type: 'npm',
  typescript: false,
  docs: false,
}

describe('create', () => {
  describe('package.json', () => {
    it('creates defaults', () => {
      const out = JSON.parse(packageJSON(MIN_OPTS));
      expect(out.main).to.equal('index.js');
      expect(out.module).to.equal('index.js');
      expect(out.type).to.equal('module');
      expect(out.types).to.equal('index.d.ts');
      expect(out.exports["."]["import"]).to.equal('./index.js');
    });

    it('creates a package.json with license', () => {    
      const out = JSON.parse(packageJSON(MIN_OPTS));
      expect(out.license).to.equal('MIT');
    });
    
    it('creates a package.json name', () => {
      const out = JSON.parse(packageJSON(MIN_OPTS));
      expect(out.name).to.equal('create_test');
    });
    
    it('creates a package.json name with scope', () => {
      const opts = {
        ...MIN_OPTS,
        scope: '@test',
      }
      const out = JSON.parse(packageJSON(opts));
      expect(out.name).to.equal('@test/create_test');
      expect(out.author).to.equal('@test');
    });
  });
});