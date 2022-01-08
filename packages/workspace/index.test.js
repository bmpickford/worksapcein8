import { expect } from 'chai';
import { FileReadWrite as File } from './filereadwrite.js';
import { create } from './index.js';
import { spy, match } from 'sinon';

const DEFAULT_OPTS = {
    out_dir: '.',
    workspace_name: 'test'
}

describe('workspace', function () {
  it('generates all files', async function() {
    const fileWriteSpy = spy();
    File.write = fileWriteSpy;
    await create(DEFAULT_OPTS);

    expect(fileWriteSpy.calledWith('./package.json', match.any)).to.be.true;
    expect(fileWriteSpy.calledWith('./README.md', match.any)).to.be.true;
    expect(fileWriteSpy.calledWith('./LICENSE', match.any)).to.be.true;
    expect(fileWriteSpy.calledWith('./.editorconfig', match.any)).to.be.true;
    expect(fileWriteSpy.calledWith('./.gitignore', match.any)).to.be.true;
    expect(fileWriteSpy.calledWith('./.eslintrc.js', match.any)).to.be.true;
  });
});