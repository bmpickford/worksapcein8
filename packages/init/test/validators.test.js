import * as validators from '../validators/index.js';
import { expect } from 'chai';

describe('validators', () => {
    describe('validatePackageName', () => {
        it('should return true for valid package name', () => {
            const packageName = 'test';
            expect(validators.validatePackageName(packageName)).to.be.true;
        });

        it('should return error string for empty string', () => {
            const packageName = '';
            expect(validators.validatePackageName(packageName)).to.be.a('string');
        });

        it('should return error string for null', () => {
            const packageName = null;
            expect(validators.validatePackageName(packageName)).to.be.a('string');
        });

        it('should return error string for undefined', () => {
            const packageName = undefined;
            expect(validators.validatePackageName(packageName)).to.be.a('string');
        });

        it('should return error string for number', () => {
            const packageName = 100;
            expect(validators.validatePackageName(packageName)).to.be.a('string');
        });
    });

    describe('validateScope', () => {
        it('should return true for valid package scope', () => {
            const scope = '@test';
            expect(validators.validateScope(scope)).to.be.true;
        });

        it('should return true for empty string', () => {
            const scope = '';
            expect(validators.validateScope(scope)).to.be.true;
        });

        it('should return error string for string without "@"', () => {
            const scope = 'test';
            expect(validators.validateScope(scope)).to.be.a('string');
        });
    });
});