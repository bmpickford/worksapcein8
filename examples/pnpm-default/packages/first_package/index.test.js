import { expect } from 'chai';
import { my_package_name } from './index.js';

describe('first_package', () => {
    it('should return the correct package name', () => {
        expect(my_package_name).to.equal('first_package');
    });
});