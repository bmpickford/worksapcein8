import { my_package_name } from './index.js';

describe('create_test', () => {
    it('should return the correct package name', () => {
        expect(my_package_name).to.equal('create_test');
    });
});