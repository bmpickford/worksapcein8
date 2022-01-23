import { expect } from 'chai';
import { create } from './index.js';
import { stub } from 'sinon';
import { CorePackageGenerator } from '@workspacein8/core';

const DEFAULT_OPTS = {
  out_dir: '.',
  workspace_type: 'npm',
  license: 'MIT',
  package_name: 'test',
};

describe('workspace', function () {
  it('generates all files', async function () {
    const generateSpy = stub(CorePackageGenerator.prototype, 'generate');
    await create(DEFAULT_OPTS);

    expect(generateSpy.calledWith('package.json')).to.be.true;
    expect(generateSpy.calledWith('README.md')).to.be.true;
    expect(generateSpy.calledWith('index.js')).to.be.true;
    expect(generateSpy.calledWith('index.test.js')).to.be.true;
  });
});
