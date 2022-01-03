import names from './index.js';
import { expect } from 'chai';

describe('module:names', () => {
    it('should import named', () => {
        expect(names[0]).to.equal('Benjamin');
    });
});