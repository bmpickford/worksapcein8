import { getRandomItemFromArray } from './index.js';
import { expect } from 'chai';

describe('module:functions', () => {
    it('get element with one item', () => {
        expect(getRandomItemFromArray(['name'])).to.equal('name');
    });

    it('get element with multiple items', () => {
        expect(getRandomItemFromArray(['name', 'name'])).to.equal('name');
    });
});