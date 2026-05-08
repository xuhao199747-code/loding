// liaison-app/visbug/visbug-bridge.js
/**
 * Adapter layer between Liaison and VisBug.
 * Reuses VisBug's selection, guides, move, text-edit when available.
 * Falls back to native implementations if VisBug is absent.
 */

export class VisBugBridge {
  constructor() {
    this.visbug = null;
    this.detectVisBug();
  }

  detectVisBug() {
    // VisBug injects a <vis-bug> custom element
    const visbugEl = document.querySelector('vis-bug');
    if (visbugEl && visbugEl.active) {
      this.visbug = visbugEl;
    }
  }

  // Selection
  getSelection() {
    if (this.visbug?.selected) {
      return this.visbug.selected.map(el => this.wrapElement(el));
    }
    // Fallback: query Liaison's own selection marks
    return Array.from(document.querySelectorAll('[data-liaison-selected="true"]'))
      .map(el => this.wrapElement(el));
  }

  wrapElement(el) {
    const path = this.getElementPath(el);
    return {
      element: el,
      id: el.dataset.liaisonId || this.generateId(el),
      path,
      rect: el.getBoundingClientRect(),
      identity: {
        tag: el.tagName.toLowerCase(),
        id: el.id,
        classes: Array.from(el.classList),
        testId: el.dataset.testid || el.dataset.testId || null
      },
      text: el.innerText?.slice(0, 200) || '',
      source: this.getSourceInfo(el),
      reactComponentTree: this.getReactTree(el)
    };
  }

  generateId(el) {
    const id = 'liaison-' + Math.random().toString(36).slice(2, 9);
    el.dataset.liaisonId = id;
    return id;
  }

  getElementPath(el) {
    const path = [];
    while (el && el.nodeType === 1) {
      let selector = el.tagName.toLowerCase();
      if (el.id) selector += `#${el.id}`;
      if (el.className) {
        const classes = Array.from(el.classList).slice(0, 2).join('.');
        if (classes) selector += `.${classes}`;
      }
      path.unshift(selector);
      el = el.parentElement;
    }
    return path.join(' > ');
  }

  // Guides / Measurement
  showGuides(fromEl, toEl) {
    if (this.visbug?.showDistance) {
      this.visbug.showDistance(fromEl, toEl);
      return;
    }
    // Native fallback: draw SVG lines
    this.drawNativeGuides(fromEl, toEl);
  }

  drawNativeGuides(fromEl, toEl) {
    // Implementation in selection/guides.js
    window.dispatchEvent(new CustomEvent('liaison-show-guides', {
      detail: { from: fromEl, to: toEl }
    }));
  }

  // Move / Auto-layout
  moveElement(el, dx, dy) {
    if (this.visbug?.move) {
      this.visbug.move(el, dx, dy);
      return;
    }
    const current = window.getComputedStyle(el);
    const left = parseFloat(current.left) || 0;
    const top = parseFloat(current.top) || 0;
    el.style.position = el.style.position || 'relative';
    el.style.left = (left + dx) + 'px';
    el.style.top = (top + dy) + 'px';
  }

  // Text editing
  editText(el) {
    if (this.visbug?.editText) {
      this.visbug.editText(el);
      return;
    }
    el.contentEditable = 'true';
    el.focus();
    const onBlur = () => {
      el.contentEditable = 'false';
      el.removeEventListener('blur', onBlur);
      window.dispatchEvent(new CustomEvent('liaison-text-edited', {
        detail: { element: el, text: el.innerText }
      }));
    };
    el.addEventListener('blur', onBlur);
  }

  // Style write-back
  setStyle(el, property, value) {
    const before = el.style[property];
    el.style[property] = value;
    window.dispatchEvent(new CustomEvent('liaison-style-change', {
      detail: { targetId: el.dataset.liaisonId, property, before, after: value }
    }));
  }

  // React DevTools integration
  getReactTree(el) {
    if (!window.__REACT_DEVTOOLS_GLOBAL_HOOK__) return null;
    const fiber = this.findReactFiber(el);
    if (!fiber) return null;
    return this.fiberToTree(fiber);
  }

  findReactFiber(el) {
    const key = Object.keys(el).find(k => k.startsWith('__reactFiber$') || k.startsWith('__reactInternalInstance$'));
    return key ? el[key] : null;
  }

  fiberToTree(fiber, depth = 0) {
    if (!fiber || depth > 5) return null;
    const name = fiber.type?.displayName || fiber.type?.name || fiber.type || 'unknown';
    return {
      name,
      key: fiber.key,
      source: fiber._debugSource || null,
      children: [fiber.child, fiber.sibling]
        .filter(Boolean)
        .map(c => this.fiberToTree(c, depth + 1))
        .filter(Boolean)
    };
  }

  getSourceInfo(el) {
    const fiber = this.findReactFiber(el);
    if (fiber?._debugSource) {
      return {
        file: fiber._debugSource.fileName,
        line: fiber._debugSource.lineNumber,
        column: fiber._debugSource.columnNumber
      };
    }
    return null;
  }
}

export const visbugBridge = new VisBugBridge();
