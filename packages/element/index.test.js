import { expect, fixture, html } from '@open-wc/testing';
import './index.js';

describe('module:element', () => {
  it('renders', async () => {
    const el = await fixture(html`<npmworkspaces-lit-example name="test"></npmworkspaces-lit-example>`);
    const text = el.shadowRoot.querySelector('p').innerText;
    expect(text).to.eq('Hello, test!');
  });
});