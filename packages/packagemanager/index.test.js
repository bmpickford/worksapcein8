import { PackageManager } from './index.js';
import { expect } from 'chai';
import sinon, { spy, match } from 'sinon';

const DEFAULT_CWD = './';
const DEFAULT_MANAGER = 'npm';
const execSpy = spy();

describe('packageManager', function () {
  beforeEach(function () {
    sinon.reset();
  });

  it('should pass cwd', function () {
    const manager = new PackageManager(DEFAULT_CWD, DEFAULT_MANAGER, execSpy);
    manager.add('test');
    expect(execSpy.calledWith(match.string, { cwd: './' })).to.be.true;
  });

  it('should run install', function () {
    const manager = new PackageManager(DEFAULT_CWD, DEFAULT_MANAGER, execSpy);
    manager.add('test');
    expect(execSpy.calledWith('npm install', { cwd: './' })).to.be.true;
  });

  it('should run npm add command', function () {
    const manager = new PackageManager(DEFAULT_CWD, DEFAULT_MANAGER, execSpy);
    manager.add('test');
    expect(execSpy.calledWith('npm i test', match.any)).to.be.true;
  });

  it('should run yarn1 add command', function () {
    const manager = new PackageManager(DEFAULT_CWD, 'yarn', execSpy);
    manager.add('test');
    expect(execSpy.calledWith('yarn add test -W', match.any)).to.be.true;
  });

  it('should run yarn2 add command', function () {
    const manager = new PackageManager(DEFAULT_CWD, 'yarn2', execSpy);
    manager.add('test');
    expect(execSpy.calledWith('yarn add test', match.any)).to.be.true;
  });

  it('should set version for yarn 2', function () {
    const manager = new PackageManager(DEFAULT_CWD, 'yarn2', execSpy);
    manager.add('test');
    expect(execSpy.calledWith('yarn set version latest', match.any)).to.be.true;
  });

  it('should run pnpm add command', function () {
    const manager = new PackageManager(DEFAULT_CWD, 'pnpm', execSpy);
    manager.add('test');
    expect(execSpy.calledWith('pnpm add test', match.any)).to.be.true;
  });
});
