import { expect } from 'chai';
import { create } from './index.js';
import { stub } from 'sinon';
import { CorePackageGenerator } from '@workspacein8/core';

const DEFAULT_OPTS = {
    out_dir: '.',
    workspace_name: 'test'
}

describe('workspace', function () {
  it('generates all files', async function() {
    const generateSpy = stub(CorePackageGenerator.prototype, "generate");
    await create(DEFAULT_OPTS);

    expect(generateSpy.calledWith('package.json')).to.be.true;
    expect(generateSpy.calledWith('README.md')).to.be.true;
    expect(generateSpy.calledWith('LICENSE')).to.be.true;
    expect(generateSpy.calledWith('.editorconfig')).to.be.true;
    expect(generateSpy.calledWith('.gitignore')).to.be.true;
    expect(generateSpy.calledWith('.eslintrc.js')).to.be.true;
  });
});
