// liaison-app/features/page-overview/page-overview-panel.element.js
import { store, MODES } from '../../state/store.js';
import { generatePrompt, generateSinglePrompt, exportJSON, importJSON } from '../../shared/serialization.js';

export class LiaisonPageOverview extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.currentTab = 'all';
  }

  connectedCallback() {
    this.render();
    this.bindEvents();
    store.subscribe('edits', () => this.refresh());
    store.subscribe('comments', () => this.refresh());
    store.subscribe('overviewOpen', (o) => {
      this.style.display = o ? 'block' : 'none';
      if (o) this.refresh();
      const sp = store.get('stylePanel');
      if (o) { this._prevPinned = sp.pinned; store.set('stylePanel', { ...sp, pinned: false }); }
      else if (this._prevPinned !== undefined) { store.set('stylePanel', { ...sp, pinned: this._prevPinned }); }
    });
  }

  render() {
    const url = chrome.runtime.getURL('liaison-app/features/page-overview/page-overview-panel.element.css');
    this.shadowRoot.innerHTML = `
      <link rel="stylesheet" href="${url}">
      <div class="panel" id="panel">
        <div class="panel-header">
          <div class="header-title">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            <span>Overview</span>
          </div>
          <div class="header-actions">
            <button class="icon-btn" id="exportBtn" title="Export JSON">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            </button>
            <button class="icon-btn" id="importBtn" title="Import JSON">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            </button>
            <button class="icon-btn" id="promptBtn" title="Copy Prompt">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg>
            </button>
            <button class="icon-btn" id="closeBtn" title="Close">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
        </div>

        <div class="tabs">
          <button class="tab active" data-tab="all">
            All <span class="tab-count" id="countAll">0</span>
          </button>
          <button class="tab" data-tab="configs">
            Configs <span class="tab-count" id="countConfigs">0</span>
          </button>
          <button class="tab" data-tab="comments">
            Comments <span class="tab-count" id="countComments">0</span>
          </button>
        </div>

        <div class="panel-body" id="body">
          <div class="list" id="list"></div>
        </div>
      </div>
    `;
  }

  bindEvents() {
    this.shadowRoot.querySelectorAll('.tab').forEach(tab => {
      tab.addEventListener('click', () => {
        this.currentTab = tab.dataset.tab;
        this.shadowRoot.querySelectorAll('.tab').forEach(t => t.classList.toggle('active', t.dataset.tab === this.currentTab));
        this.refresh();
      });
    });
    this.shadowRoot.getElementById('closeBtn').addEventListener('click', () => store.set('overviewOpen', false));
    this.shadowRoot.getElementById('exportBtn').addEventListener('click', () => window.dispatchEvent(new CustomEvent('liaison-export-json')));
    this.shadowRoot.getElementById('importBtn').addEventListener('click', () => {
      const json = prompt('Paste JSON:');
      if (json) window.dispatchEvent(new CustomEvent('liaison-import-json', { detail: { json } }));
    });
    this.shadowRoot.getElementById('promptBtn').addEventListener('click', () => window.dispatchEvent(new CustomEvent('liaison-generate-prompt')));
  }

  refresh() {
    const list = this.shadowRoot.getElementById('list');
    const edits = Array.from(store.state.edits.values());
    const comments = Array.from(store.state.comments.values());
    this.shadowRoot.getElementById('countAll').textContent = edits.length + comments.length;
    this.shadowRoot.getElementById('countConfigs').textContent = edits.length;
    this.shadowRoot.getElementById('countComments').textContent = comments.length;

    let items = [];
    if (this.currentTab === 'all') {
      items = [...edits.map(e => ({ type: 'edit', data: e })), ...comments.map(c => ({ type: 'comment', data: c }))];
    } else if (this.currentTab === 'configs') {
      items = edits.map(e => ({ type: 'edit', data: e }));
    } else {
      items = comments.map(c => ({ type: 'comment', data: c }));
    }

    if (items.length === 0) {
      list.innerHTML = `
        <div class="empty-state">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#444" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>
          <p>No ${this.currentTab === 'all' ? 'items' : this.currentTab} yet</p>
        </div>
      `;
      return;
    }

    list.innerHTML = '';
    items.forEach(item => {
      const row = document.createElement('div');
      row.className = 'overview-row';
      if (item.type === 'edit') {
        const e = item.data;
        const colorBadges = Object.entries(e.managedData || {})
          .filter(([k]) => k.includes('Color') || k.includes('fill'))
          .map(([k, v]) => {
            if (v.mode === 'gradient') return `<span class="badge gradient">Gradient</span>`;
            return `<span class="badge" style="background:${v.hex};color:${this.contrastColor(v.hex)}">${v.hex}</span>`;
          }).join('');
        row.innerHTML = `
          <div class="row-header">
            <span class="row-title">${e.label || e.heading || e.identity?.tag || 'Element'}</span>
            <span class="row-path">${e.elementPath?.split(' > ').pop() || ''}</span>
          </div>
          <div class="row-body">
            ${e.configs?.map(c => `<span class="chip">${c.property}: ${c.value}</span>`).join('') || ''}
            ${colorBadges}
          </div>
          <div class="row-actions">
            <button class="action-btn" data-action="locate" data-id="${e.id}">Locate</button>
            <button class="action-btn" data-action="reset" data-id="${e.id}">Reset</button>
            <button class="action-btn primary" data-action="copy" data-id="${e.id}">Copy</button>
          </div>
        `;
      } else {
        const c = item.data;
        const isBatch = c.isBatch;
        row.innerHTML = `
          <div class="row-header">
            <span class="row-title">${isBatch ? '📦 Batch' : '💬 Comment'}</span>
            <span class="row-path">${c.items?.length || 0}</span>
          </div>
          <div class="row-body">
            ${c.items?.map(i => `<div class="comment-preview">${this.escapeHtml(i.text)}</div>`).join('') || ''}
          </div>
          ${isBatch ? `<div class="row-meta">${c.groupedElementPaths?.length || 0} elements</div>` : ''}
          <div class="row-actions">
            <button class="action-btn" data-action="locate" data-id="${c.targetId}">Locate</button>
            <button class="action-btn primary" data-action="copy" data-id="${c.targetId}">Copy</button>
          </div>
        `;
      }
      list.appendChild(row);
      row.querySelectorAll('.action-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = btn.dataset.id;
          if (btn.dataset.action === 'locate') this.locate(id);
          if (btn.dataset.action === 'reset') this.reset(id);
          if (btn.dataset.action === 'copy') this.copyPrompt(id);
        });
      });
    });
  }

  locate(id) {
    const edit = store.state.edits.get(id);
    if (edit) {
      const el = document.querySelector(`[data-liaison-id="${id}"]`);
      if (el) { el.scrollIntoView({ behavior: 'smooth', block: 'center' }); store.select(visbugBridge.wrapElement(el)); store.set('mode', MODES.DESIGN); store.set('overviewOpen', false); }
    }
    const comment = store.state.comments.get(id);
    if (comment?.isBatch && comment.groupedElementPaths?.length) {
      // Simplified path resolution
    }
  }

  reset(id) {
    const edit = store.state.edits.get(id);
    if (!edit) return;
    edit.configs?.forEach(cfg => {
      const el = document.querySelector(`[data-liaison-id="${id}"]`);
      if (el) el.style[cfg.property] = cfg.original || '';
    });
    store.removeEdit(id); this.refresh();
  }

  async copyPrompt(id) {
    const prompt = generateSinglePrompt(id);
    if (!prompt) return;
    try { await navigator.clipboard.writeText(prompt); }
    catch {
      const ta = document.createElement('textarea'); ta.value = prompt;
      document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta);
    }
    window.dispatchEvent(new CustomEvent('liaison-toast', { detail: { message: 'Prompt copied' } }));
  }

  contrastColor(hex) {
    const rgb = parseInt(hex.slice(1), 16);
    const r = (rgb >> 16) & 0xff, g = (rgb >> 8) & 0xff, b = (rgb >> 0) & 0xff;
    return (0.299 * r + 0.587 * g + 0.114 * b) > 128 ? '#111' : '#fff';
  }

  escapeHtml(text) { const div = document.createElement('div'); div.textContent = text; return div.innerHTML; }
}

if (!customElements.get('liaison-page-overview')) {
  customElements.define('liaison-page-overview', LiaisonPageOverview);
}
