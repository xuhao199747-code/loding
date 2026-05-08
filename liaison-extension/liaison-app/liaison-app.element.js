// liaison-app/liaison-app.element.js
/**
 * LiaisonApp - Root container for the entire Liaison extension UI.
 * Plain DOM version (no Custom Elements) for maximum compatibility.
 */

import { store, MODES } from './state/store.js';
import { historyManager } from './state/history.js';
import { visbugBridge } from './visbug/visbug-bridge.js';
import { exportJSON, importJSON, generatePrompt } from './shared/serialization.js';

export class LiaisonApp {
  constructor() {
    this.element = document.createElement('div');
    this.element.id = 'liaison-app';
    this.element.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:100vh;pointer-events:none;z-index:2147483646;display:none;font-family:"Inter",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;';

    this.shadowRoot = this.element.attachShadow({ mode: 'open' });
    this.panels = {};
    this._boundKeydown = this.onKeydown.bind(this);

    this.render();
    this.setupGlobalEvents();
    this.defineSubElements();
    store.set('active', false);
    document.body.classList.add('visbug-liaison-active');
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        .liaison-root { position: absolute; inset: 0; pointer-events: none; }
        .liaison-root > * { pointer-events: auto; }
        .overlay-layer { position: absolute; inset: 0; pointer-events: none; }

        .liaison-toolbar {
          position: fixed; top: 12px; left: 50%; transform: translateX(-50%); z-index: 2147483647;
          background: #2c2c2c; border: 1px solid #3e3e3e; border-radius: 10px;
          padding: 6px 14px; display: flex; align-items: center; gap: 4px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.35); font-size: 13px; white-space: nowrap; user-select: none;
        }
        .liaison-toolbar .brand { font-weight: 700; color: #a259ff; margin-right: 8px; font-size: 14px; letter-spacing: 0.3px; }
        .liaison-toolbar .sep { color: #555; margin: 0 4px; }
        .liaison-toolbar .mode-btn { padding: 4px 10px; border-radius: 6px; cursor: pointer; color: #b0b0b0; transition: all 0.15s; }
        .liaison-toolbar .mode-btn:hover { color: #fff; background: #3e3e3e; }
        .liaison-toolbar .mode-btn.active { color: #fff; background: #444; }

        .liaison-panel {
          position: fixed; top: 56px; right: 16px; width: 280px; z-index: 2147483647;
          background: #2c2c2c; border: 1px solid #3e3e3e; border-radius: 12px;
          box-shadow: 0 12px 40px rgba(0,0,0,0.4); font-size: 13px; overflow: hidden;
        }
        .liaison-panel-header {
          padding: 14px 16px 10px; font-weight: 600; color: #e6e6e6; font-size: 13px;
          border-bottom: 1px solid #3e3e3e; display: flex; align-items: center; justify-content: space-between;
        }
        .liaison-panel-body { padding: 14px 16px; color: #b0b0b0; font-size: 12px; line-height: 1.7; }
        .liaison-panel-body .hint { color: #888; font-size: 11px; margin-top: 8px; padding-top: 8px; border-top: 1px solid #3e3e3e; }
        .liaison-panel-body .kbd {
          display: inline-block; background: #3e3e3e; padding: 1px 5px; border-radius: 4px;
          font-size: 11px; color: #ccc; font-family: monospace; margin: 0 1px;
        }

        .liaison-hover-box {
          position: fixed; border: 1px solid #a259ff; pointer-events: none;
          background: rgba(162,89,255,0.06); z-index: 2147483645; transition: all 0.05s ease;
        }
        .liaison-selection-box {
          position: fixed; border: 2px solid #a259ff; pointer-events: none;
          z-index: 2147483645; box-sizing: border-box;
        }
        .liaison-selection-label {
          position: absolute; top: -22px; left: 0; background: #a259ff; color: #fff;
          font-size: 10px; padding: 3px 8px; border-radius: 4px; white-space: nowrap;
          font-weight: 600; letter-spacing: 0.2px; box-shadow: 0 2px 8px rgba(162,89,255,0.3);
        }

        .liaison-toast {
          position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%);
          background: #1e1e1e; color: #e0e0e0; padding: 10px 18px; border-radius: 8px;
          font-size: 12px; z-index: 2147483647; pointer-events: none;
          box-shadow: 0 4px 16px rgba(0,0,0,0.3); border: 1px solid #333;
          font-weight: 500; animation: toastIn 0.2s ease;
        }
        @keyframes toastIn {
          from { opacity: 0; transform: translateX(-50%) translateY(8px); }
          to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      </style>
      <div id="liaison-root" class="liaison-root">
        <div id="toolbar"></div>
        <div id="stylePanel" class="liaison-panel" style="display:none;"></div>
        <div id="commentPanel" class="liaison-panel" style="display:none;"></div>
        <div id="overview" class="liaison-panel" style="display:none;"></div>
        <div id="colorPopover" style="position:fixed;z-index:2147483647;display:none;"></div>
        <div id="reactInfo" style="position:fixed;z-index:2147483647;display:none;"></div>
        <div id="overlay-layer" class="overlay-layer"></div>
      </div>
    `;
    this.root = this.shadowRoot.getElementById('liaison-root');
    this.overlay = this.shadowRoot.getElementById('overlay-layer');
  }

  defineSubElements() {
    const toolbar = this.shadowRoot.getElementById('toolbar');
    toolbar.innerHTML = `
      <div class="liaison-toolbar">
        <span class="brand">Liaison</span>
        <span class="sep">|</span>
        <span class="mode-btn active" data-mode="${MODES.DESIGN}">设计</span>
        <span class="mode-btn" data-mode="${MODES.GUIDES}">标注</span>
        <span class="mode-btn" data-mode="${MODES.COMMENT}">评论</span>
        <span class="mode-btn" data-mode="${MODES.AUTO_LAYOUT}">布局</span>
      </div>
    `;
    toolbar.querySelectorAll('.mode-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        toolbar.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        store.set('mode', e.target.dataset.mode);
      });
    });

    const stylePanel = this.shadowRoot.getElementById('stylePanel');
    stylePanel.innerHTML = `
      <div class="liaison-panel-header">样式面板</div>
      <div class="liaison-panel-body">
        点击页面中的元素来查看和编辑样式属性。
        <div class="hint">
          快捷键：<span class="kbd">D</span> 设计模式
          <span class="kbd">G</span> 标注模式
          <span class="kbd">C</span> 评论模式
          <span class="kbd">O</span> 概览
          <span class="kbd">Esc</span> 取消选择
        </div>
      </div>
    `;

    const commentPanel = this.shadowRoot.getElementById('commentPanel');
    commentPanel.innerHTML = `
      <div class="liaison-panel-header">评论</div>
      <div class="liaison-panel-body">点击页面元素添加评论批注。</div>
    `;

    const overview = this.shadowRoot.getElementById('overview');
    overview.innerHTML = `
      <div class="liaison-panel-header">页面概览</div>
      <div class="liaison-panel-body">查看当前页面的所有修改记录。</div>
    `;

    this.panels.toolbar = toolbar;
    this.panels.stylePanel = stylePanel;
    this.panels.commentPanel = commentPanel;
    this.panels.overview = overview;

    this.syncPanelVisibility();
    store.subscribe('mode', () => this.syncPanelVisibility());
    store.subscribe('overviewOpen', () => this.syncPanelVisibility());
  }

  syncPanelVisibility() {
    const mode = store.get('mode');
    const overviewOpen = store.get('overviewOpen');
    const styleVisible = [MODES.DESIGN, MODES.GUIDES, MODES.AUTO_LAYOUT].includes(mode);

    if (this.panels.stylePanel) {
      this.panels.stylePanel.style.display = styleVisible && !overviewOpen ? 'block' : 'none';
    }
    if (this.panels.commentPanel) {
      this.panels.commentPanel.style.display = mode === MODES.COMMENT ? 'block' : 'none';
    }
    if (this.panels.overview) {
      this.panels.overview.style.display = overviewOpen ? 'block' : 'none';
    }
    if (this.panels.toolbar) {
      this.panels.toolbar.querySelectorAll('.mode-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.mode === mode);
      });
    }
  }

  setupGlobalEvents() {
    document.addEventListener('keydown', this._boundKeydown);

    document.addEventListener('click', (e) => {
      if (!store.get('active')) return;
      const path = e.composedPath ? e.composedPath() : [];
      if (path.some(el => el.id === 'liaison-app' || (el.classList && el.classList.contains('liaison-toolbar')))) return;

      const mode = store.get('mode');
      if (mode === MODES.COMMENT) {
        this.handleCommentClick(e);
        return;
      }
      const multi = e.shiftKey;
      const target = e.target;
      const record = visbugBridge.wrapElement(target);
      store.select(record, multi);
      e.preventDefault();
      e.stopPropagation();
    }, true);

    document.addEventListener('mouseover', (e) => {
      if (!store.get('active')) return;
      const path = e.composedPath ? e.composedPath() : [];
      if (path.some(el => el.id === 'liaison-app')) {
        store.set('hoveredElement', null);
        return;
      }
      const record = visbugBridge.wrapElement(e.target);
      store.set('hoveredElement', record);
    }, true);

    window.addEventListener('liaison-export-json', () => {
      const json = exportJSON();
      this.copyToClipboard(json);
      this.showToast('JSON 已导出到剪贴板');
    });

    window.addEventListener('liaison-import-json', (e) => {
      const result = importJSON(e.detail.json);
      this.showToast(result.success ? `已导入 ${result.count} 处修改` : `导入失败：${result.error}`);
    });

    window.addEventListener('liaison-generate-prompt', () => {
      const prompt = generatePrompt();
      this.copyToClipboard(prompt);
      this.showToast('提示词已复制到剪贴板');
    });
  }

  handleCommentClick(e) {
    const target = e.target;
    const record = visbugBridge.wrapElement(target);
    window.dispatchEvent(new CustomEvent('liaison-add-comment-request', {
      detail: { record, x: e.clientX, y: e.clientY }
    }));
  }

  onKeydown(e) {
    if (!store.get('active')) return;
    if (e.key === 'd' && !e.ctrlKey && !e.metaKey) store.set('mode', MODES.DESIGN);
    if (e.key === 'g') store.set('mode', MODES.GUIDES);
    if (e.key === 'c') store.set('mode', MODES.COMMENT);
    if (e.key === 'a') store.set('mode', MODES.AUTO_LAYOUT);
    if (e.key === 'o') store.set('overviewOpen', !store.get('overviewOpen'));
    if (e.key === 'Escape') {
      if (store.get('overviewOpen')) store.set('overviewOpen', false);
      else store.clearSelection();
    }
  }

  toggle() {
    const active = !store.get('active');
    store.set('active', active);
    this.element.style.display = active ? 'block' : 'none';
  }

  async copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
  }

  showToast(msg) {
    const toast = document.createElement('div');
    toast.className = 'liaison-toast';
    toast.textContent = msg;
    this.shadowRoot.appendChild(toast);
    setTimeout(() => toast.remove(), 2500);
  }
}
