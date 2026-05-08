// liaison-app/state/history.js
import { store } from './store.js';

const MAX_HISTORY = 50;

export class HistoryManager {
  constructor() {
    this.stack = [];
    this.index = -1;
    this.subscribe();
  }

  subscribe() {
    // Listen to style changes and snapshot them
    window.addEventListener('liaison-style-change', (e) => {
      this.push({
        type: 'style',
        targetId: e.detail.targetId,
        property: e.detail.property,
        before: e.detail.before,
        after: e.detail.after
      });
    });

    window.addEventListener('keydown', (e) => {
      const isUndo = (e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey;
      const isRedo = (e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey));
      if (isUndo) { e.preventDefault(); this.undo(); }
      if (isRedo) { e.preventDefault(); this.redo(); }
    });
  }

  push(action) {
    // Truncate forward history if we're not at tip
    if (this.index < this.stack.length - 1) {
      this.stack = this.stack.slice(0, this.index + 1);
    }
    this.stack.push(action);
    if (this.stack.length > MAX_HISTORY) this.stack.shift();
    else this.index++;
  }

  undo() {
    if (this.index < 0) return;
    const action = this.stack[this.index];
    this.index--;
    this.revert(action);
    window.dispatchEvent(new CustomEvent('liaison-undo', { detail: action }));
  }

  redo() {
    if (this.index >= this.stack.length - 1) return;
    this.index++;
    const action = this.stack[this.index];
    this.apply(action);
    window.dispatchEvent(new CustomEvent('liaison-redo', { detail: action }));
  }

  revert(action) {
    if (action.type === 'style') {
      const el = document.querySelector(`[data-liaison-id="${action.targetId}"]`);
      if (el) {
        el.style[action.property] = action.before;
        window.dispatchEvent(new CustomEvent('liaison-style-reverted', {
          detail: { targetId: action.targetId, property: action.property, value: action.before }
        }));
      }
    }
  }

  apply(action) {
    if (action.type === 'style') {
      const el = document.querySelector(`[data-liaison-id="${action.targetId}"]`);
      if (el) {
        el.style[action.property] = action.after;
        window.dispatchEvent(new CustomEvent('liaison-style-applied', {
          detail: { targetId: action.targetId, property: action.property, value: action.after }
        }));
      }
    }
  }
}

export const historyManager = new HistoryManager();
