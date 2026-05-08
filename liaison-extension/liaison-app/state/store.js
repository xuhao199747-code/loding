// liaison-app/state/store.js
export const MODES = {
  DESIGN: 'design',
  GUIDES: 'guides',
  COMMENT: 'comment',
  AUTO_LAYOUT: 'auto-layout',
  OVERVIEW: 'overview'
};

export const TABS = {
  STYLE: 'style',
  CODE: 'code'
};

class Store {
  constructor() {
    this.state = {
      mode: MODES.DESIGN,
      active: false,
      selectedElements: [],
      hoveredElement: null,
      lastSelectedId: null,
      edits: new Map(),
      comments: new Map(),
      sharedElements: new Map(),
      history: [],
      historyIndex: -1,
      stylePanel: {
        open: true,
        pinned: false,
        side: 'right',
        tab: TABS.STYLE,
        width: 240
      },
      toolbar: {
        collapsed: false,
        position: { x: null, y: 16 },
        dock: 'top'
      },
      overviewOpen: false,
      colorPopover: {
        open: false,
        targetField: null,
        colorType: 'fill',
        layerIndex: 0
      },
      pageData: {
        url: location.href,
        title: document.title,
        timestamp: Date.now()
      }
    };
    this.listeners = new Map();
    this.batchDepth = 0;
    this.batchChanges = new Set();
  }

  subscribe(key, callback) {
    if (!this.listeners.has(key)) this.listeners.set(key, new Set());
    this.listeners.get(key).add(callback);
    return () => this.listeners.get(key).delete(callback);
  }

  get(key) {
    return this.state[key];
  }

  set(key, value) {
    const old = this.state[key];
    this.state[key] = value;
    if (old !== value) {
      if (this.batchDepth > 0) {
        this.batchChanges.add(key);
      } else {
        this.emit(key, value, old);
      }
    }
  }

  batch(fn) {
    this.batchDepth++;
    try { fn(); }
    finally {
      this.batchDepth--;
      if (this.batchDepth === 0) {
        this.batchChanges.forEach(key => this.emit(key, this.state[key]));
        this.batchChanges.clear();
      }
    }
  }

  emit(key, value, old) {
    if (this.listeners.has(key)) {
      this.listeners.get(key).forEach(cb => cb(value, old, key));
    }
  }

  select(record, multi = false) {
    const current = this.state.selectedElements;
    let next;
    if (multi) {
      const exists = current.find(r => r.id === record.id);
      if (exists) next = current.filter(r => r.id !== record.id);
      else next = [...current, record];
    } else {
      next = [record];
    }
    this.set('selectedElements', next);
    this.set('lastSelectedId', record.id);
  }

  clearSelection() {
    this.set('selectedElements', []);
    this.set('lastSelectedId', null);
  }

  getEdit(id) {
    return this.state.edits.get(id) || this.createEmptyEdit(id);
  }

  createEmptyEdit(id) {
    return {
      id,
      elementPath: '',
      groupedElementPaths: [],
      label: '',
      heading: '',
      identity: {},
      text: '',
      frame: {},
      source: null,
      reactComponentTree: null,
      styleText: '',
      managedData: {},
      configs: [],
      comments: [],
      feedback: ''
    };
  }

  updateEdit(id, patch) {
    const existing = this.state.edits.get(id) || this.createEmptyEdit(id);
    const updated = { ...existing, ...patch };
    this.state.edits.set(id, updated);
    this.emit('edits', this.state.edits);
    this.pushHistory({ type: 'edit', id, patch });
  }

  removeEdit(id) {
    this.state.edits.delete(id);
    this.emit('edits', this.state.edits);
  }

  addComment(targetId, comment) {
    const record = this.state.comments.get(targetId) || { targetId, items: [] };
    record.items.push({
      id: (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : 'c-' + Date.now() + '-' + Math.random().toString(36).slice(2, 9),
      text: comment.text,
      author: comment.author || 'You',
      timestamp: Date.now(),
      resolved: false
    });
    this.state.comments.set(targetId, record);
    this.emit('comments', this.state.comments);
  }

  removeComment(targetId, commentId) {
    const record = this.state.comments.get(targetId);
    if (!record) return;
    record.items = record.items.filter(c => c.id !== commentId);
    if (record.items.length === 0) this.state.comments.delete(targetId);
    this.emit('comments', this.state.comments);
  }

  pushHistory(action) {
    const { history, historyIndex } = this.state;
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push({ ...action, time: Date.now() });
    this.set('history', newHistory);
    this.set('historyIndex', newHistory.length - 1);
  }

  undo() {
    const { historyIndex, history } = this.state;
    if (historyIndex < 0) return;
    const action = history[historyIndex];
    this.applyInverse(action);
    this.set('historyIndex', historyIndex - 1);
  }

  redo() {
    const { historyIndex, history } = this.state;
    if (historyIndex >= history.length - 1) return;
    const action = history[historyIndex + 1];
    this.applyAction(action);
    this.set('historyIndex', historyIndex + 1);
  }

  applyInverse(action) {
    if (action.type === 'edit') {
      this.emit('undo', action);
    }
  }

  applyAction(action) {
    this.emit('redo', action);
  }

  serialize() {
    return {
      version: '1.0.0',
      page: this.state.pageData,
      edits: Array.from(this.state.edits.values()),
      comments: Array.from(this.state.comments.values()),
      sharedElements: Array.from(this.state.sharedElements.entries()),
      meta: { exportedAt: Date.now(), tool: 'Liaison' }
    };
  }

  deserialize(data) {
    if (data.edits) data.edits.forEach(e => this.state.edits.set(e.id, e));
    if (data.comments) data.comments.forEach(c => this.state.comments.set(c.targetId, c));
    if (data.sharedElements) data.sharedElements.forEach(([k, v]) => this.state.sharedElements.set(k, v));
    this.emit('edits', this.state.edits);
    this.emit('comments', this.state.comments);
  }
}

export const store = new Store();
