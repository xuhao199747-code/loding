// liaison-app/features/toolbar/top-toolbar.element.js
import { store, MODES } from '../../state/store.js';

export class LiaisonTopToolbar extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.dragging = false;
    this.dragOffset = { x: 0, y: 0 };
  }

  connectedCallback() {
    this.render();
    this.bindEvents();
    store.subscribe('mode', (m) => this.updateMode(m));
    store.subscribe('toolbar', (t) => this.updateLayout(t));
    store.subscribe('overviewOpen', (o) => {
      const btn = this.shadowRoot.querySelector('[data-mode="overview"]');
      if (btn) btn.classList.toggle('active', o);
    });
  }

  render() {
    const url = chrome.runtime.getURL('liaison-app/features/toolbar/top-toolbar.element.css');
    this.shadowRoot.innerHTML = `
      <link rel="stylesheet" href="${url}">
      <div class="toolbar-wrapper" id="wrapper">
        <!-- Main Figma-style toolbar -->
        <div class="toolbar" id="toolbar">
          <div class="toolbar-left">
            <div class="logo-mark">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="3" width="8" height="8" rx="2" fill="#6366f1"/>
                <rect x="13" y="3" width="8" height="8" rx="2" fill="#818cf8"/>
                <rect x="3" y="13" width="8" height="8" rx="2" fill="#4f46e5"/>
                <rect x="13" y="13" width="8" height="8" rx="2" fill="#c7d2fe"/>
              </svg>
              <span class="logo-text">Liaison</span>
            </div>
            <div class="toolbar-divider"></div>
            <div class="mode-segmented">
              <button class="seg-btn ${store.get('mode') === MODES.DESIGN ? 'active' : ''}" data-mode="design" title="Design (D)">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="M2 2l7.586 7.586"/><circle cx="11" cy="11" r="2"/></svg>
              </button>
              <button class="seg-btn ${store.get('mode') === MODES.GUIDES ? 'active' : ''}" data-mode="guides" title="Guides (G)">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 3v18h18"/><path d="M7 12h2"/><path d="M7 8h2"/><path d="M7 16h2"/><path d="M11 12h2"/><path d="M11 8h2"/><path d="M11 16h2"/><path d="M15 12h2"/><path d="M15 8h2"/><path d="M15 16h2"/></svg>
              </button>
              <button class="seg-btn ${store.get('mode') === MODES.COMMENT ? 'active' : ''}" data-mode="comment" title="Comment (C)">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              </button>
              <button class="seg-btn ${store.get('mode') === MODES.AUTO_LAYOUT ? 'active' : ''}" data-mode="auto-layout" title="Auto Layout (A)">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>
              </button>
            </div>
          </div>

          <div class="toolbar-center">
            <div class="mode-segmented">
              <button class="seg-btn ${store.get('overviewOpen') ? 'active' : ''}" data-mode="overview" title="Overview (O)">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                <span>配置</span>
              </button>
            </div>
          </div>

          <div class="toolbar-right">
            <button class="icon-btn" id="pinBtn" title="固定编辑器">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l-5.5 9h11z"/><circle cx="12" cy="17" r="2"/><path d="M12 19v3"/></svg>
            </button>
            <button class="icon-btn" id="moreBtn" title="更多">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
            </button>
            <button class="icon-btn" id="collapseBtn" title="收起">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="18 15 12 9 6 15"/></svg>
            </button>
          </div>

          <!-- Drag handle at bottom center -->
          <div class="drag-handle" id="dragHandle" title="Drag to move">
            <div class="drag-dots">
              <span></span><span></span><span></span>
            </div>
          </div>
        </div>

        <!-- Collapsed pill -->
        <div class="toolbar-collapsed" id="collapsed" style="display:none">
          <button class="pill-btn" id="expandBtn" title="展开 Liaison">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
            <span>Liaison</span>
          </button>
        </div>

        <!-- More menu -->
        <div class="more-menu" id="moreMenu" style="display:none">
          <div class="menu-item" data-action="pin">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l-5.5 9h11z"/><circle cx="12" cy="17" r="2"/></svg>
            固定编辑器
          </div>
          <div class="menu-item" data-action="feedback">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
            问题反馈
          </div>
          <div class="menu-divider"></div>
          <div class="menu-item" data-action="export-json">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            导出 JSON
          </div>
          <div class="menu-item" data-action="import-json">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            导入 JSON
          </div>
          <div class="menu-item" data-action="prompt">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg>
            生成 Prompt
          </div>
        </div>
      </div>
    `;
  }

  bindEvents() {
    const wrapper = this.shadowRoot.getElementById('wrapper');
    const dragHandle = this.shadowRoot.getElementById('dragHandle');
    const moreMenu = this.shadowRoot.getElementById('moreMenu');

    // Mode switching
    this.shadowRoot.querySelectorAll('[data-mode]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const mode = btn.dataset.mode;
        if (mode === 'overview') {
          store.set('overviewOpen', !store.get('overviewOpen'));
        } else {
          store.set('mode', mode);
          store.set('overviewOpen', false);
        }
      });
    });

    // Dragging
    dragHandle.addEventListener('mousedown', (e) => {
      this.dragging = true;
      const rect = wrapper.getBoundingClientRect();
      this.dragOffset = { x: e.clientX - rect.left, y: e.clientY - rect.top };
      wrapper.style.transition = 'none';
      dragHandle.classList.add('dragging');
    });

    document.addEventListener('mousemove', (e) => {
      if (!this.dragging) return;
      let x = e.clientX - this.dragOffset.x;
      let y = e.clientY - this.dragOffset.y;
      wrapper.style.left = x + 'px';
      wrapper.style.top = y + 'px';
      wrapper.style.right = 'auto';
      wrapper.style.bottom = 'auto';
      wrapper.style.transform = 'none';

      const rect = wrapper.getBoundingClientRect();
      const nearTop = y < 60;
      const nearBottom = window.innerHeight - y - rect.height < 60;
      this.showSnapHint(nearTop ? 'top' : (nearBottom ? 'bottom' : null));
    });

    document.addEventListener('mouseup', () => {
      if (!this.dragging) return;
      this.dragging = false;
      dragHandle.classList.remove('dragging');
      wrapper.style.transition = 'top 0.25s cubic-bezier(0.4, 0, 0.2, 1), left 0.25s cubic-bezier(0.4, 0, 0.2, 1)';
      const rect = wrapper.getBoundingClientRect();
      let dock = 'top';
      if (window.innerHeight - rect.bottom < 60) {
        dock = 'bottom';
        wrapper.style.top = 'auto';
        wrapper.style.bottom = '16px';
      } else if (rect.top < 60) {
        dock = 'top';
        wrapper.style.top = '16px';
        wrapper.style.bottom = 'auto';
      }
      const centerX = window.innerWidth / 2 - rect.width / 2;
      if (Math.abs(rect.left - centerX) < 120) {
        wrapper.style.left = centerX + 'px';
      }
      store.set('toolbar', { ...store.get('toolbar'), dock });
      this.hideSnapHint();
    });

    // Collapse / expand
    this.shadowRoot.getElementById('collapseBtn').addEventListener('click', () => this.setCollapsed(true));
    this.shadowRoot.getElementById('expandBtn').addEventListener('click', () => this.setCollapsed(false));

    // More menu
    this.shadowRoot.getElementById('moreBtn').addEventListener('click', (e) => {
      e.stopPropagation();
      moreMenu.style.display = moreMenu.style.display === 'none' ? 'block' : 'none';
    });
    document.addEventListener('click', () => { moreMenu.style.display = 'none'; });

    moreMenu.querySelectorAll('.menu-item').forEach(item => {
      item.addEventListener('click', () => this.handleMenuAction(item.dataset.action));
    });

    // Pin toggle
    this.shadowRoot.getElementById('pinBtn').addEventListener('click', () => {
      const sp = store.get('stylePanel');
      store.set('stylePanel', { ...sp, pinned: !sp.pinned });
      this.showToast(sp.pinned ? '编辑器已取消固定' : '编辑器已固定');
    });
  }

  updateMode(mode) {
    this.shadowRoot.querySelectorAll('.seg-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.mode === mode);
    });
  }

  updateLayout(toolbarState) {
    const wrapper = this.shadowRoot.getElementById('wrapper');
    if (toolbarState.dock === 'bottom') {
      wrapper.style.top = 'auto';
      wrapper.style.bottom = '16px';
    } else {
      wrapper.style.top = '16px';
      wrapper.style.bottom = 'auto';
    }
  }

  setCollapsed(collapsed) {
    store.set('toolbar', { ...store.get('toolbar'), collapsed });
    this.shadowRoot.getElementById('toolbar').style.display = collapsed ? 'none' : 'flex';
    this.shadowRoot.getElementById('collapsed').style.display = collapsed ? 'block' : 'none';
  }

  showSnapHint(position) {
    let hint = this.shadowRoot.getElementById('snapHint');
    if (!hint) {
      hint = document.createElement('div');
      hint.id = 'snapHint';
      hint.style.cssText = `
        position: fixed; left: 50%; transform: translateX(-50%);
        background: #111827; color: #fff; padding: 6px 14px; border-radius: 6px;
        font-size: 11px; pointer-events: none; z-index: 2147483647;
        transition: opacity 0.2s; opacity: 0; font-weight: 500;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
      `;
      this.shadowRoot.appendChild(hint);
    }
    if (position) {
      hint.textContent = position === 'top' ? '吸附到顶部' : '吸附到底部';
      hint.style.top = position === 'top' ? '4px' : 'auto';
      hint.style.bottom = position === 'bottom' ? '4px' : 'auto';
      hint.style.opacity = '1';
    } else {
      hint.style.opacity = '0';
    }
  }

  hideSnapHint() {
    const hint = this.shadowRoot.getElementById('snapHint');
    if (hint) hint.style.opacity = '0';
  }

  handleMenuAction(action) {
    switch (action) {
      case 'pin': {
        const sp = store.get('stylePanel');
        store.set('stylePanel', { ...sp, pinned: !sp.pinned });
        break;
      }
      case 'feedback':
        window.open('https://github.com/your-org/liaison/issues', '_blank');
        break;
      case 'export-json':
        window.dispatchEvent(new CustomEvent('liaison-export-json'));
        break;
      case 'import-json': {
        const json = prompt('粘贴 JSON 配置:');
        if (json) window.dispatchEvent(new CustomEvent('liaison-import-json', { detail: { json } }));
        break;
      }
      case 'prompt':
        window.dispatchEvent(new CustomEvent('liaison-generate-prompt'));
        break;
    }
  }

  showToast(msg) {
    window.dispatchEvent(new CustomEvent('liaison-toast', { detail: { message: msg } }));
  }
}
