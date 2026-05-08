// liaison-app/features/selection/selectable.js
import { store } from '../../state/store.js';
import { visbugBridge } from '../../visbug/visbug-bridge.js';

export class SelectionManager {
  constructor() {
    this.hoverOverlay = null;
    this.selectionOverlays = new Map();
    this.init();
  }

  init() {
    store.subscribe('hoveredElement', (record) => this.onHover(record));
    store.subscribe('selectedElements', (records) => this.onSelectionChange(records));
    this.createOverlayContainer();
  }

  createOverlayContainer() {
    this.container = document.createElement('div');
    this.container.id = 'liaison-selection-layer';
    this.container.style.cssText = `
      position: fixed; inset: 0; pointer-events: none; z-index: 2147483645;
    `;
    document.body.appendChild(this.container);
  }

  onHover(record) {
    if (!record) {
      if (this.hoverOverlay) { this.hoverOverlay.remove(); this.hoverOverlay = null; }
      return;
    }
    const rect = record.rect;
    if (!this.hoverOverlay) {
      this.hoverOverlay = document.createElement('div');
      this.hoverOverlay.className = 'liaison-hover-box';
      this.hoverOverlay.style.cssText = `
        position: fixed;
        border: 1px solid #6366f1;
        pointer-events: none;
        background: rgba(99, 102, 241, 0.06);
        z-index: 2147483645;
        transition: all 0.05s ease;
        border-radius: 2px;
      `;
      this.container.appendChild(this.hoverOverlay);
    }
    this.hoverOverlay.style.left = rect.left + 'px';
    this.hoverOverlay.style.top = rect.top + 'px';
    this.hoverOverlay.style.width = rect.width + 'px';
    this.hoverOverlay.style.height = rect.height + 'px';
  }

  onSelectionChange(records) {
    this.selectionOverlays.forEach((el, id) => {
      if (!records.find(r => r.id === id)) {
        el.remove();
        this.selectionOverlays.delete(id);
      }
    });

    records.forEach(record => {
      let box = this.selectionOverlays.get(record.id);
      const rect = record.element.getBoundingClientRect();
      if (!box) {
        box = document.createElement('div');
        box.className = 'liaison-selection-box';
        box.style.cssText = `
          position: fixed;
          border: 2px solid #6366f1;
          pointer-events: none;
          z-index: 2147483645;
          box-sizing: border-box;
          border-radius: 2px;
        `;
        const label = document.createElement('div');
        label.className = 'liaison-selection-label';
        label.style.cssText = `
          position: absolute;
          top: -24px;
          left: 0;
          background: #6366f1;
          color: #fff;
          font-size: 10px;
          padding: 3px 8px;
          border-radius: 4px;
          white-space: nowrap;
          font-family: "Inter", sans-serif;
          font-weight: 600;
          letter-spacing: 0.2px;
          box-shadow: 0 2px 8px rgba(99,102,241,0.3);
        `;
        label.textContent = record.identity.tag + (record.identity.classes[0] ? '.' + record.identity.classes[0] : '');
        box.appendChild(label);
        this.container.appendChild(box);
        this.selectionOverlays.set(record.id, box);
      }
      box.style.left = rect.left + 'px';
      box.style.top = rect.top + 'px';
      box.style.width = rect.width + 'px';
      box.style.height = rect.height + 'px';
    });
  }

  getSelectedElements() {
    return store.get('selectedElements');
  }

  refreshRects() {
    const records = store.get('selectedElements');
    this.onSelectionChange(records);
  }
}

export const selectionManager = new SelectionManager();

window.addEventListener('scroll', () => selectionManager.refreshRects(), true);
window.addEventListener('resize', () => selectionManager.refreshRects());
