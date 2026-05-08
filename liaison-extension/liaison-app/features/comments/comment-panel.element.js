// liaison-app/features/comments/comment-panel.element.js
import { store } from '../../state/store.js';
import { visbugBridge } from '../../visbug/visbug-bridge.js';

export class LiaisonCommentPanel extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.anchors = new Map();
    this.inlineInput = null;
  }

  connectedCallback() {
    this.render();
    this.bindEvents();
    store.subscribe('comments', () => this.refreshList());
    store.subscribe('selectedElements', (r) => this.onSelectionChange(r));
    window.addEventListener('liaison-add-comment-request', (e) => this.openInlineInput(e.detail));
    window.addEventListener('liaison-color-picked', (e) => {
      const { targetField, value } = e.detail;
      const sp = document.querySelector('liaison-style-panel');
      if (sp) {
        const input = sp.shadowRoot.getElementById(targetField.replace('Swatch', 'Value') || targetField.replace('Swatch', 'Hex'));
        if (input) input.value = value;
        const swatch = sp.shadowRoot.getElementById(targetField);
        if (swatch) swatch.style.background = value.startsWith('gradient:') ? 'linear-gradient(90deg, #6366f1, #ec4899)' : value;
      }
    });
  }

  render() {
    const url = chrome.runtime.getURL('liaison-app/features/comments/comment-panel.element.css');
    this.shadowRoot.innerHTML = `
      <link rel="stylesheet" href="${url}">
      <div class="panel" id="panel">
        <div class="panel-header">
          <div class="header-title">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            <span>Comments</span>
          </div>
          <span class="count-badge" id="countBadge">0</span>
        </div>
        <div class="panel-body" id="body">
          <div class="empty-state" id="emptyState">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#555" stroke-width="1.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            <p>Click any element to comment</p>
            <p class="hint">Shift-click for batch comment</p>
          </div>
          <div class="comment-list" id="commentList" style="display:none"></div>
        </div>
      </div>
    `;
  }

  bindEvents() {}

  openInlineInput({ record, x, y }) {
    if (this.inlineInput) this.inlineInput.remove();
    const selected = store.get('selectedElements');
    const isBatch = selected.length > 1;
    const targets = isBatch ? selected : [record];

    this.inlineInput = document.createElement('div');
    this.inlineInput.className = 'liaison-inline-comment';
    this.inlineInput.style.cssText = `
      position: fixed; left: ${x}px; top: ${y + 16}px;
      background: #1e1e1e; border: 1px solid #333; border-radius: 10px;
      padding: 12px; box-shadow: 0 16px 48px rgba(0,0,0,0.4);
      z-index: 2147483647; width: 260px; font-family: "Inter", sans-serif;
      animation: commentPop 0.15s ease;
    `;
    this.inlineInput.innerHTML = `
      <style>
        @keyframes commentPop { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
      </style>
      <div style="font-size:11px;color:#888;margin-bottom:8px;font-weight:500">
        ${isBatch ? `Batch comment · ${targets.length} elements` : record.identity.tag + (record.identity.classes[0] ? '.' + record.identity.classes[0] : '')}
      </div>
      <textarea style="width:100%;border:1px solid #333;border-radius:6px;padding:8px;font-size:12px;resize:vertical;min-height:64px;outline:none;background:#252525;color:#e0e0e0;font-family:inherit" placeholder="Write a comment..."></textarea>
      <div style="display:flex;justify-content:flex-end;gap:6px;margin-top:10px">
        <button class="cancel-btn" style="padding:5px 12px;font-size:11px;border:1px solid #333;background:transparent;border-radius:6px;cursor:pointer;color:#888">Cancel</button>
        <button class="submit-btn" style="padding:5px 12px;font-size:11px;border:none;background:#6366f1;color:#fff;border-radius:6px;cursor:pointer;font-weight:500">Post</button>
      </div>
    `;
    document.body.appendChild(this.inlineInput);

    const textarea = this.inlineInput.querySelector('textarea');
    textarea.focus();

    this.inlineInput.querySelector('.cancel-btn').addEventListener('click', () => {
      this.inlineInput.remove(); this.inlineInput = null;
    });

    this.inlineInput.querySelector('.submit-btn').addEventListener('click', () => {
      const text = textarea.value.trim();
      if (!text) return;
      if (isBatch) {
        const batchId = 'batch-' + crypto.randomUUID();
        store.state.comments.set(batchId, {
          targetId: batchId, isBatch: true,
          groupedElementPaths: targets.map(t => t.path),
          items: [{ id: crypto.randomUUID(), text, author: 'You', timestamp: Date.now(), resolved: false }]
        });
        store.emit('comments', store.state.comments);
        this.createAnchor(batchId, targets[0].element, true, targets.length);
      } else {
        store.addComment(record.id, { text });
        this.createAnchor(record.id, record.element);
      }
      this.inlineInput.remove(); this.inlineInput = null;
      this.refreshList();
    });

    const closeOnOutside = (e) => {
      if (!this.inlineInput?.contains(e.target)) {
        this.inlineInput?.remove(); this.inlineInput = null;
        document.removeEventListener('click', closeOnOutside, true);
      }
    };
    setTimeout(() => document.addEventListener('click', closeOnOutside, true), 0);
  }

  createAnchor(targetId, element, isBatch = false, count = 1) {
    if (this.anchors.has(targetId)) this.anchors.get(targetId).remove();
    const anchor = document.createElement('div');
    anchor.className = 'liaison-comment-anchor';
    anchor.dataset.targetId = targetId;
    anchor.style.cssText = `
      position: fixed; z-index: 2147483645; pointer-events: auto;
      width: 22px; height: 22px; border-radius: 50%;
      background: #6366f1; color: #fff; font-size: 10px;
      display: flex; align-items: center; justify-content: center;
      font-weight: 700; cursor: pointer; box-shadow: 0 2px 8px rgba(99,102,241,0.4);
      border: 2px solid #1e1e1e;
      transition: transform 0.15s;
    `;
    anchor.textContent = isBatch ? count : '1';
    const updatePosition = () => {
      const rect = element.getBoundingClientRect();
      anchor.style.left = (rect.right + 6) + 'px';
      anchor.style.top = (rect.top - 6) + 'px';
    };
    updatePosition();
    document.body.appendChild(anchor);
    this.anchors.set(targetId, anchor);
    const updater = () => updatePosition();
    window.addEventListener('scroll', updater, true);
    window.addEventListener('resize', updater);
    anchor.addEventListener('click', () => this.highlightComment(targetId));
    anchor.addEventListener('mouseenter', () => anchor.style.transform = 'scale(1.15)');
    anchor.addEventListener('mouseleave', () => anchor.style.transform = 'scale(1)');
  }

  refreshList() {
    const list = this.shadowRoot.getElementById('commentList');
    const empty = this.shadowRoot.getElementById('emptyState');
    const badge = this.shadowRoot.getElementById('countBadge');
    const allComments = Array.from(store.state.comments.values());
    const total = allComments.reduce((sum, c) => sum + c.items.length, 0);
    badge.textContent = total;
    if (allComments.length === 0) {
      empty.style.display = 'flex'; list.style.display = 'none'; return;
    }
    empty.style.display = 'none'; list.style.display = 'block'; list.innerHTML = '';
    allComments.forEach(record => {
      const card = document.createElement('div');
      card.className = 'comment-card';
      card.dataset.targetId = record.targetId;
      const targetLabel = record.isBatch
        ? `Batch · ${record.groupedElementPaths?.length || 1} elements`
        : (store.state.edits.get(record.targetId)?.label || record.targetId.slice(0, 8));
      card.innerHTML = `
        <div class="comment-target">${targetLabel}</div>
        ${record.items.map(item => `
          <div class="comment-item" data-id="${item.id}">
            <div class="comment-text">${this.escapeHtml(item.text)}</div>
            <div class="comment-meta">
              <span class="author">${item.author}</span>
              <span class="time">${this.formatTime(item.timestamp)}</span>
            </div>
            <div class="comment-actions">
              <button class="action-btn edit" data-id="${item.id}">Edit</button>
              <button class="action-btn delete" data-id="${item.id}">Delete</button>
            </div>
          </div>
        `).join('')}
      `;
      list.appendChild(card);
      card.querySelectorAll('.delete').forEach(btn => {
        btn.addEventListener('click', () => { store.removeComment(record.targetId, btn.dataset.id); this.refreshList(); });
      });
      card.querySelectorAll('.edit').forEach(btn => {
        btn.addEventListener('click', () => {
          const item = record.items.find(i => i.id === btn.dataset.id);
          if (!item) return;
          const newText = prompt('Edit comment:', item.text);
          if (newText !== null) { item.text = newText; store.emit('comments', store.state.comments); this.refreshList(); }
        });
      });
    });
  }

  highlightComment(targetId) {
    this.shadowRoot.querySelectorAll('.comment-card').forEach(c => {
      c.classList.toggle('highlighted', c.dataset.targetId === targetId);
    });
  }

  onSelectionChange(records) {}

  escapeHtml(text) {
    const div = document.createElement('div'); div.textContent = text; return div.innerHTML;
  }

  formatTime(ts) {
    const d = new Date(ts);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
}

if (!customElements.get('liaison-comment-panel')) {
  customElements.define('liaison-comment-panel', LiaisonCommentPanel);
}
