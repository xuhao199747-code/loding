// liaison-app/features/react-dev/react-info.element.js
/**
 * Small overlay showing React component info for selected element.
 */

import { store } from '../../state/store.js';
import { reactDevBridge } from './react-dev-bridge.js';

export class LiaisonReactInfo extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
    store.subscribe('selectedElements', (r) => this.update(r));
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; position: fixed; bottom: 16px; left: 16px; z-index: 2147483647; }
        .card {
          background: #111827; color: #f3f4f6; border-radius: 10px;
          padding: 10px 14px; font-size: 11px; font-family: "SF Mono", monospace;
          box-shadow: 0 10px 25px rgba(0,0,0,0.3); max-width: 300px;
          line-height: 1.6;
        }
        .card.empty { display: none; }
        .label { color: #9ca3af; }
        .value { color: #a7f3d0; }
        .tree { margin-top: 6px; padding-top: 6px; border-top: 1px solid #374151; }
      </style>
      <div class="card empty" id="card"></div>
    `;
  }

  update(records) {
    const card = this.shadowRoot.getElementById('card');
    if (!records.length || !reactDevBridge.isAvailable()) {
      card.classList.add('empty');
      return;
    }

    const el = records[0].element;
    const source = reactDevBridge.getSourceInfo(el);
    const tree = reactDevBridge.getComponentTree(el, 3);
    const ownerStack = reactDevBridge.getOwnerStack(el);

    let html = '';
    if (source) {
      html += `<div><span class="label">Source:</span> <span class="value">${source.fileName}:${source.lineNumber}</span></div>`;
    }
    if (ownerStack.length) {
      html += `<div><span class="label">Owner:</span> <span class="value">${ownerStack.map(o => o.name).join(' > ')}</span></div>`;
    }
    if (tree) {
      html += `<div class="tree"><span class="label">Component Tree:</span><pre style="margin:4px 0 0;color:#d1d5db;font-size:10px;white-space:pre-wrap">${reactDevBridge.formatTreeForPrompt(tree)}</pre></div>`;
    }

    if (!html) {
      card.classList.add('empty');
      return;
    }

    card.innerHTML = html;
    card.classList.remove('empty');
  }
}

if (!customElements.get('liaison-react-info')) {
  customElements.define('liaison-react-info', LiaisonReactInfo);
}
