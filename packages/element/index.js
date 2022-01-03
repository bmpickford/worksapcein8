import { html, css, LitElement } from 'lit';

/**
 * Test lit WC for monorepo
 * 
 * @public
 */
export class NPMWorkspacesLitExample extends LitElement {
  static styles = css`p { color: blue }`;

  static properties = {
    name: {type: String},
  };

  constructor() {
    super();
    this.name = 'Somebody';
  }

  render() {
    return html`<p>Hello, ${this.name}!</p>`;
  }
}
customElements.define('npmworkspaces-lit-example', NPMWorkspacesLitExample);