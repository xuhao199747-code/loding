// liaison-app/features/style-panel/style-panel.element.js
import { store, TABS } from '../../state/store.js';
import { visbugBridge } from '../../visbug/visbug-bridge.js';
import { clamp } from '../../shared/utils.js';

export class LiaisonStylePanel extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.dragging = false;
    this.dragStartSide = 'right';
    this.sharedEnabled = false;
    this.expandedSections = new Set(['layout', 'typography', 'fill']);
  }

  connectedCallback() {
    this.render();
    this.bindEvents();
    store.subscribe('selectedElements', (r) => this.onSelectionChange(r));
    store.subscribe('stylePanel', (s) => this.onPanelStateChange(s));
    store.subscribe('mode', () => this.onSelectionChange(store.get('selectedElements')));
  }

  render() {
    const url = chrome.runtime.getURL('liaison-app/features/style-panel/style-panel.element.css');
    this.shadowRoot.innerHTML = `
      <link rel="stylesheet" href="${url}">
      <div class="panel" id="panel">
        <!-- Header - shows selected element name like Figma -->
        <div class="panel-header" id="header">
          <div class="header-title">
            <span class="element-icon" id="elementIcon">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>
            </span>
            <span class="element-name" id="elementName">未选择</span>
          </div>
          <div class="header-actions">
            <button class="header-btn ${store.get('stylePanel').pinned ? 'pinned' : ''}" id="pinBtn" title="固定面板">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l-5.5 9h11z"/><circle cx="12" cy="17" r="2"/></svg>
            </button>
            <button class="header-btn" id="closeBtn" title="关闭">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
        </div>

        <!-- Tabs like Figma right panel -->
        <div class="panel-tabs">
          <button class="panel-tab active" data-tab="style">Design</button>
          <button class="panel-tab" data-tab="code">Code</button>
        </div>

        <div class="panel-body" id="body">
          <!-- DESIGN TAB -->
          <div class="tab-content active" data-tab="style">
            ${this.renderFigmaStyleTab()}
          </div>

          <!-- CODE TAB -->
          <div class="tab-content" data-tab="code">
            <div class="code-header">
              <span class="code-label">CSS</span>
              <button class="code-copy" id="codeCopy">复制</button>
            </div>
            <textarea class="code-area" id="codeArea" spellcheck="false"></textarea>
          </div>
        </div>

        <!-- Snap hint overlay -->
        <div class="snap-overlay" id="snapOverlay" style="display:none">
          <div class="snap-zone left" id="snapLeft">
            <div class="snap-label">固定到左侧</div>
          </div>
          <div class="snap-zone right" id="snapRight">
            <div class="snap-label">固定到右侧</div>
          </div>
        </div>
      </div>
    `;
  }

  renderFigmaStyleTab() {
    return `
      <!-- Layout Section -->
      <div class="disclosure ${this.expandedSections.has('layout') ? 'expanded' : ''}" data-section="layout">
        <button class="disclosure-header">
          <svg class="disclosure-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
          <span>Layout</span>
          <span class="disclosure-badge" id="layoutBadge"></span>
        </button>
        <div class="disclosure-content">
          <div class="prop-row">
            <span class="prop-label">W</span>
            <div class="prop-input-wrap">
              <input type="text" class="prop-input" id="widthInput" value="auto" />
              <div class="stepper">
                <button class="step-up">▲</button>
                <button class="step-down">▼</button>
              </div>
            </div>
            <span class="prop-label">H</span>
            <div class="prop-input-wrap">
              <input type="text" class="prop-input" id="heightInput" value="auto" />
              <div class="stepper">
                <button class="step-up">▲</button>
                <button class="step-down">▼</button>
              </div>
            </div>
          </div>
          <div class="prop-row">
            <span class="prop-label">X</span>
            <div class="prop-input-wrap">
              <input type="number" class="prop-input" id="xInput" value="0" />
            </div>
            <span class="prop-label">Y</span>
            <div class="prop-input-wrap">
              <input type="number" class="prop-input" id="yInput" value="0" />
            </div>
          </div>
          <div class="prop-row">
            <span class="prop-label full">Sizing</span>
            <select class="prop-select" id="sizingMode">
              <option value="fixed">Fixed</option>
              <option value="hug">Hug</option>
              <option value="fill">Fill</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Auto Layout Section -->
      <div class="disclosure ${this.expandedSections.has('autoLayout') ? 'expanded' : ''}" data-section="autoLayout">
        <button class="disclosure-header">
          <svg class="disclosure-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
          <span>Auto layout</span>
          <span class="disclosure-badge" id="autoLayoutBadge"></span>
        </button>
        <div class="disclosure-content">
          <div class="prop-row">
            <span class="prop-label full">Direction</span>
            <div class="icon-toggle" id="flexDir">
              <button class="icon-tgl active" data-value="row" title="Horizontal">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12h18"/><path d="M6 8v8"/><path d="M18 8v8"/></svg>
              </button>
              <button class="icon-tgl" data-value="column" title="Vertical">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3v18"/><path d="M8 6h8"/><path d="M8 18h8"/></svg>
              </button>
            </div>
          </div>
          <div class="prop-row">
            <span class="prop-label">Gap</span>
            <div class="prop-input-wrap">
              <input type="number" class="prop-input" id="gapInput" value="0" />
              <div class="stepper">
                <button class="step-up">▲</button>
                <button class="step-down">▼</button>
              </div>
            </div>
          </div>
          <div class="prop-row">
            <span class="prop-label full">Align</span>
            <div class="icon-toggle grid-3" id="alignItems">
              <button class="icon-tgl" data-value="flex-start" title="Top/Left">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="4" y1="4" x2="20" y2="4"/><line x1="4" y1="10" x2="14" y2="10"/><line x1="4" y1="16" x2="10" y2="16"/></svg>
              </button>
              <button class="icon-tgl active" data-value="center" title="Center">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="4" y1="4" x2="20" y2="4"/><line x1="7" y1="10" x2="17" y2="10"/><line x1="4" y1="16" x2="20" y2="16"/></svg>
              </button>
              <button class="icon-tgl" data-value="flex-end" title="Bottom/Right">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="4" y1="4" x2="20" y2="4"/><line x1="10" y1="10" x2="20" y2="10"/><line x1="14" y1="16" x2="20" y2="16"/></svg>
              </button>
            </div>
          </div>
          <div class="prop-row">
            <span class="prop-label full">Justify</span>
            <div class="icon-toggle grid-3" id="justifyContent">
              <button class="icon-tgl active" data-value="flex-start" title="Start">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="4" y1="4" x2="4" y2="20"/><line x1="10" y1="8" x2="10" y2="16"/><line x1="16" y1="6" x2="16" y2="18"/></svg>
              </button>
              <button class="icon-tgl" data-value="center" title="Center">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="4" x2="12" y2="20"/><line x1="6" y1="8" x2="6" y2="16"/><line x1="18" y1="6" x2="18" y2="18"/></svg>
              </button>
              <button class="icon-tgl" data-value="space-between" title="Space Between">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="4" y1="4" x2="4" y2="20"/><line x1="20" y1="4" x2="20" y2="20"/><line x1="12" y1="6" x2="12" y2="18"/></svg>
              </button>
            </div>
          </div>
          <div class="prop-row">
            <span class="prop-label">Pad</span>
            <div class="prop-input-wrap">
              <input type="number" class="prop-input" id="paddingInput" value="0" />
              <div class="stepper">
                <button class="step-up">▲</button>
                <button class="step-down">▼</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Typography Section -->
      <div class="disclosure ${this.expandedSections.has('typography') ? 'expanded' : ''}" data-section="typography">
        <button class="disclosure-header">
          <svg class="disclosure-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
          <span>Typography</span>
        </button>
        <div class="disclosure-content">
          <div class="prop-row">
            <span class="prop-label full">Font</span>
            <input type="text" class="prop-input wide" id="fontFamily" value="Inter" />
          </div>
          <div class="prop-row">
            <span class="prop-label">Size</span>
            <div class="prop-input-wrap">
              <input type="number" class="prop-input" id="fontSize" value="16" />
              <div class="stepper">
                <button class="step-up">▲</button>
                <button class="step-down">▼</button>
              </div>
            </div>
            <span class="prop-label">Weight</span>
            <select class="prop-select" id="fontWeight">
              <option value="400">Regular</option>
              <option value="500">Medium</option>
              <option value="600">Semibold</option>
              <option value="700">Bold</option>
            </select>
          </div>
          <div class="prop-row">
            <span class="prop-label">LH</span>
            <div class="prop-input-wrap">
              <input type="number" class="prop-input" id="lineHeight" value="1.5" step="0.1" />
            </div>
            <span class="prop-label">LS</span>
            <div class="prop-input-wrap">
              <input type="number" class="prop-input" id="letterSpacing" value="0" />
            </div>
          </div>
          <div class="prop-row">
            <span class="prop-label full">Align</span>
            <div class="icon-toggle" id="textAlign">
              <button class="icon-tgl active" data-value="left">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="14" y2="12"/><line x1="4" y1="18" x2="18" y2="18"/></svg>
              </button>
              <button class="icon-tgl" data-value="center">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="6" y1="18" x2="18" y2="18"/></svg>
              </button>
              <button class="icon-tgl" data-value="right">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="4" y1="6" x2="20" y2="6"/><line x1="10" y1="12" x2="20" y2="12"/><line x1="6" y1="18" x2="20" y2="18"/></svg>
              </button>
              <button class="icon-tgl" data-value="justify">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/></svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Fill Section -->
      <div class="disclosure ${this.expandedSections.has('fill') ? 'expanded' : ''}" data-section="fill">
        <button class="disclosure-header">
          <svg class="disclosure-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
          <span>Fill</span>
          <button class="add-btn" id="addFill">+</button>
        </button>
        <div class="disclosure-content">
          <div class="fill-row" id="fillRow0">
            <div class="fill-swatch" id="fillSwatch0" style="background:#6366f1"></div>
            <span class="fill-value" id="fillValue0">#6366F1</span>
            <span class="fill-percent" id="fillPercent0">100%</span>
            <button class="fill-remove">×</button>
          </div>
        </div>
      </div>

      <!-- Stroke Section -->
      <div class="disclosure ${this.expandedSections.has('stroke') ? 'expanded' : ''}" data-section="stroke">
        <button class="disclosure-header">
          <svg class="disclosure-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
          <span>Stroke</span>
          <button class="add-btn" id="addStroke">+</button>
        </button>
        <div class="disclosure-content">
          <div class="prop-row">
            <div class="fill-swatch" id="strokeSwatch" style="background:transparent;border:1px solid #444"></div>
            <span class="fill-value" id="strokeValue">None</span>
            <div class="prop-input-wrap narrow">
              <input type="number" class="prop-input" id="strokeWidth" value="1" />
            </div>
          </div>
        </div>
      </div>

      <!-- Effects Section -->
      <div class="disclosure ${this.expandedSections.has('effects') ? 'expanded' : ''}" data-section="effects">
        <button class="disclosure-header">
          <svg class="disclosure-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
          <span>Effects</span>
          <button class="add-btn" id="addEffect">+</button>
        </button>
        <div class="disclosure-content">
          <div class="prop-row">
            <span class="prop-label">X</span>
            <div class="prop-input-wrap narrow">
              <input type="number" class="prop-input" id="shadowX" value="0" />
            </div>
            <span class="prop-label">Y</span>
            <div class="prop-input-wrap narrow">
              <input type="number" class="prop-input" id="shadowY" value="4" />
            </div>
            <span class="prop-label">Blur</span>
            <div class="prop-input-wrap narrow">
              <input type="number" class="prop-input" id="shadowBlur" value="12" />
            </div>
          </div>
          <div class="prop-row">
            <div class="fill-swatch" id="shadowSwatch" style="background:rgba(0,0,0,0.15)"></div>
            <span class="fill-value" id="shadowValue">rgba(0,0,0,0.15)</span>
          </div>
        </div>
      </div>

      <!-- Corner Radius Section -->
      <div class="disclosure ${this.expandedSections.has('radius') ? 'expanded' : ''}" data-section="radius">
        <button class="disclosure-header">
          <svg class="disclosure-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
          <span>Corner radius</span>
        </button>
        <div class="disclosure-content">
          <div class="prop-row radius-row">
            <div class="radius-inputs">
              <input type="number" class="prop-input" id="radiusTL" value="0" placeholder="TL" />
              <input type="number" class="prop-input" id="radiusTR" value="0" placeholder="TR" />
              <input type="number" class="prop-input" id="radiusBR" value="0" placeholder="BR" />
              <input type="number" class="prop-input" id="radiusBL" value="0" placeholder="BL" />
            </div>
            <button class="chain-btn active" id="chainRadius" title="Link corners">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Opacity -->
      <div class="disclosure ${this.expandedSections.has('opacity') ? 'expanded' : ''}" data-section="opacity">
        <button class="disclosure-header">
          <svg class="disclosure-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
          <span>Layer</span>
        </button>
        <div class="disclosure-content">
          <div class="prop-row">
            <span class="prop-label full">Opacity</span>
            <div class="slider-wrap">
              <input type="range" min="0" max="100" value="100" id="opacityRange" />
              <input type="number" class="prop-input pct" id="opacityInput" value="100" min="0" max="100" />
              <span class="pct-label">%</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Shared Elements -->
      <div class="disclosure ${this.expandedSections.has('shared') ? 'expanded' : ''}" data-section="shared">
        <button class="disclosure-header">
          <svg class="disclosure-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
          <span>Shared</span>
        </button>
        <div class="disclosure-content">
          <label class="toggle-row">
            <div class="toggle-track" id="sharedToggle">
              <div class="toggle-thumb"></div>
            </div>
            <span class="toggle-label">Sync similar elements</span>
          </label>
        </div>
      </div>
    `;
  }

  bindEvents() {
    const panel = this.shadowRoot.getElementById('panel');
    const header = this.shadowRoot.getElementById('header');

    // Tab switching
    this.shadowRoot.querySelectorAll('.panel-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        const tabName = tab.dataset.tab;
        store.set('stylePanel', { ...store.get('stylePanel'), tab: tabName });
        this.shadowRoot.querySelectorAll('.panel-tab').forEach(t => t.classList.toggle('active', t.dataset.tab === tabName));
        this.shadowRoot.querySelectorAll('.tab-content').forEach(c => c.classList.toggle('active', c.dataset.tab === tabName));
      });
    });

    // Pin toggle
    this.shadowRoot.getElementById('pinBtn').addEventListener('click', () => {
      const sp = store.get('stylePanel');
      store.set('stylePanel', { ...sp, pinned: !sp.pinned });
    });

    // Close
    this.shadowRoot.getElementById('closeBtn').addEventListener('click', () => {
      store.set('stylePanel', { ...store.get('stylePanel'), open: false });
      this.style.display = 'none';
    });

    // Header drag for pinned panel
    header.addEventListener('mousedown', (e) => {
      if (e.target.closest('.header-actions')) return;
      if (!store.get('stylePanel').pinned) return;
      this.dragging = true;
      this.startX = e.clientX;
      const sp = store.get('stylePanel');
      this.dragStartSide = sp.side;
      panel.style.transition = 'none';
      this.showSnapOverlay(true);
    });

    document.addEventListener('mousemove', (e) => {
      if (!this.dragging) return;
      const dx = e.clientX - this.startX;
      const threshold = window.innerWidth * 0.15;
      if (dx < -threshold && this.dragStartSide === 'right') {
        this.snapSide = 'left';
      } else if (dx > threshold && this.dragStartSide === 'left') {
        this.snapSide = 'right';
      } else {
        this.snapSide = null;
      }
      this.updateSnapVisual(this.snapSide);
    });

    document.addEventListener('mouseup', () => {
      if (!this.dragging) return;
      this.dragging = false;
      panel.style.transition = '';
      this.showSnapOverlay(false);
      if (this.snapSide) {
        store.set('stylePanel', { ...store.get('stylePanel'), side: this.snapSide });
        this.applySide(this.snapSide);
      }
    });

    // Disclosure toggles
    this.shadowRoot.querySelectorAll('.disclosure-header').forEach(hdr => {
      hdr.addEventListener('click', (e) => {
        if (e.target.closest('.add-btn')) return;
        const section = hdr.closest('.disclosure');
        const name = section.dataset.section;
        if (this.expandedSections.has(name)) {
          this.expandedSections.delete(name);
          section.classList.remove('expanded');
        } else {
          this.expandedSections.add(name);
          section.classList.add('expanded');
        }
      });
    });

    // Input bindings with steppers
    this.bindStepperInput('widthInput', 'width', (v) => v === 'auto' ? 'auto' : v + 'px');
    this.bindStepperInput('heightInput', 'height', (v) => v === 'auto' ? 'auto' : v + 'px');
    this.bindStepperInput('xInput', 'left', (v) => v + 'px');
    this.bindStepperInput('yInput', 'top', (v) => v + 'px');
    this.bindStepperInput('gapInput', 'gap', (v) => v + 'px');
    this.bindStepperInput('paddingInput', 'padding', (v) => v + 'px');
    this.bindStepperInput('fontSize', 'fontSize', (v) => v + 'px');
    this.bindStepperInput('lineHeight', 'lineHeight');
    this.bindStepperInput('letterSpacing', 'letterSpacing', (v) => v + 'px');
    this.bindStepperInput('strokeWidth', 'borderWidth', (v) => v + 'px');
    this.bindStepperInput('shadowX', '--shadow-x');
    this.bindStepperInput('shadowY', '--shadow-y');
    this.bindStepperInput('shadowBlur', '--shadow-blur');
    this.bindStepperInput('opacityInput', 'opacity', (v) => clamp(v, 0, 100) / 100, true);

    // Opacity slider
    const opacityRange = this.shadowRoot.getElementById('opacityRange');
    const opacityInput = this.shadowRoot.getElementById('opacityInput');
    if (opacityRange && opacityInput) {
      opacityRange.addEventListener('input', () => {
        opacityInput.value = opacityRange.value;
        this.applyStyle('opacity', clamp(opacityRange.value, 0, 100) / 100);
      });
      opacityInput.addEventListener('change', () => {
        opacityRange.value = opacityInput.value;
        this.applyStyle('opacity', clamp(opacityInput.value, 0, 100) / 100);
      });
    }

    // Font weight
    this.shadowRoot.getElementById('fontWeight')?.addEventListener('change', (e) => {
      this.applyStyle('fontWeight', e.target.value);
    });

    // Sizing mode
    this.shadowRoot.getElementById('sizingMode')?.addEventListener('change', (e) => {
      const val = e.target.value;
      const wInput = this.shadowRoot.getElementById('widthInput');
      const hInput = this.shadowRoot.getElementById('heightInput');
      if (val === 'hug') { wInput.value = 'auto'; hInput.value = 'auto'; }
      if (val === 'fill') { wInput.value = '100%'; hInput.value = '100%'; }
    });

    // Icon toggles
    ['flexDir', 'alignItems', 'justifyContent', 'textAlign'].forEach(id => {
      const group = this.shadowRoot.getElementById(id);
      if (!group) return;
      group.querySelectorAll('.icon-tgl').forEach(btn => {
        btn.addEventListener('click', () => {
          const prop = id === 'flexDir' ? 'flexDirection' : id;
          this.applyStyle(prop, btn.dataset.value);
          group.querySelectorAll('.icon-tgl').forEach(b => b.classList.toggle('active', b === btn));
        });
      });
    });

    // Fill swatch click -> open color popover
    this.shadowRoot.getElementById('fillSwatch0')?.addEventListener('click', () => {
      window.dispatchEvent(new CustomEvent('liaison-open-color', {
        detail: { targetField: 'fillSwatch0', colorType: 'fill', anchor: this.shadowRoot.getElementById('fillSwatch0') }
      }));
    });

    // Stroke swatch
    this.shadowRoot.getElementById('strokeSwatch')?.addEventListener('click', () => {
      window.dispatchEvent(new CustomEvent('liaison-open-color', {
        detail: { targetField: 'strokeSwatch', colorType: 'stroke', anchor: this.shadowRoot.getElementById('strokeSwatch') }
      }));
    });

    // Shadow swatch
    this.shadowRoot.getElementById('shadowSwatch')?.addEventListener('click', () => {
      window.dispatchEvent(new CustomEvent('liaison-open-color', {
        detail: { targetField: 'shadowSwatch', colorType: 'shadow', anchor: this.shadowRoot.getElementById('shadowSwatch') }
      }));
    });

    // Chain radius
    const chainBtn = this.shadowRoot.getElementById('chainRadius');
    let chained = true;
    chainBtn?.addEventListener('click', () => {
      chained = !chained;
      chainBtn.classList.toggle('active', chained);
    });

    // Radius inputs
    ['radiusTL', 'radiusTR', 'radiusBR', 'radiusBL'].forEach((id, idx) => {
      const input = this.shadowRoot.getElementById(id);
      if (!input) return;
      input.addEventListener('change', () => {
        const val = input.value + 'px';
        if (chained) {
          ['radiusTL', 'radiusTR', 'radiusBR', 'radiusBL'].forEach(rid => {
            const ri = this.shadowRoot.getElementById(rid);
            if (ri) ri.value = input.value;
          });
          this.applyStyle('borderRadius', val);
        } else {
          const corners = ['borderTopLeftRadius', 'borderTopRightRadius', 'borderBottomRightRadius', 'borderBottomLeftRadius'];
          this.applyStyle(corners[idx], val);
        }
      });
    });

    // Shared toggle
    const sharedToggle = this.shadowRoot.getElementById('sharedToggle');
    sharedToggle?.addEventListener('click', () => {
      this.sharedEnabled = !this.sharedEnabled;
      sharedToggle.classList.toggle('active', this.sharedEnabled);
      const selected = store.get('selectedElements');
      if (selected.length > 0 && this.sharedEnabled) {
        const sel = selected[0];
        const selector = this.buildSelector(sel.element);
        const matches = Array.from(document.querySelectorAll(selector));
        const ids = matches.map(el => visbugBridge.wrapElement(el).id);
        store.state.sharedElements.set(selector, { enabled: true, ids });
      }
    });

    // Code copy
    this.shadowRoot.getElementById('codeCopy')?.addEventListener('click', () => {
      const ta = this.shadowRoot.getElementById('codeArea');
      navigator.clipboard.writeText(ta.value);
      window.dispatchEvent(new CustomEvent('liaison-toast', { detail: { message: 'CSS copied' } }));
    });
  }

  buildSelector(el) {
    let sel = el.tagName.toLowerCase();
    if (el.id) sel += `#${el.id}`;
    else if (el.className) sel += '.' + Array.from(el.classList).slice(0, 2).join('.');
    return sel;
  }

  bindStepperInput(id, cssProp, transform, isRaw) {
    const input = this.shadowRoot.getElementById(id);
    if (!input) return;
    let startVal = 0;
    let startX = 0;

    // Drag on input to change value
    input.addEventListener('mousedown', (e) => {
      if (e.button !== 0) return;
      startVal = parseFloat(input.value) || 0;
      startX = e.clientX;
      const onMove = (me) => {
        const delta = Math.round((me.clientX - startX) / 2);
        let newVal = startVal + delta;
        if (id === 'opacityInput') newVal = clamp(newVal, 0, 100);
        input.value = newVal;
        const val = isRaw ? newVal / 100 : (transform ? transform(newVal) : newVal + 'px');
        this.applyStyle(cssProp, val);
      };
      const onUp = () => {
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onUp);
      };
      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup', onUp);
    });

    input.addEventListener('keydown', (e) => {
      e.stopPropagation();
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        input.value = (parseFloat(input.value) || 0) + 1;
        input.dispatchEvent(new Event('change'));
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        input.value = (parseFloat(input.value) || 0) - 1;
        input.dispatchEvent(new Event('change'));
      }
    });

    input.addEventListener('change', () => {
      const val = isRaw ? parseFloat(input.value) / 100 : (transform ? transform(input.value) : input.value + 'px');
      this.applyStyle(cssProp, val);
    });

    // Stepper buttons
    const wrap = input.closest('.prop-input-wrap');
    if (wrap) {
      wrap.querySelector('.step-up')?.addEventListener('click', () => {
        input.value = (parseFloat(input.value) || 0) + 1;
        input.dispatchEvent(new Event('change'));
      });
      wrap.querySelector('.step-down')?.addEventListener('click', () => {
        input.value = (parseFloat(input.value) || 0) - 1;
        input.dispatchEvent(new Event('change'));
      });
    }
  }

  applyStyle(prop, value) {
    const selected = store.get('selectedElements');
    if (!selected.length) return;
    const targets = [...selected.map(r => r.element)];

    if (this.sharedEnabled) {
      const sel = selected[0];
      const selector = this.buildSelector(sel.element);
      const shared = store.state.sharedElements.get(selector);
      if (shared?.enabled) {
        shared.ids.forEach(id => {
          const el = document.querySelector(`[data-liaison-id="${id}"]`);
          if (el && !targets.includes(el)) targets.push(el);
        });
      }
    }

    targets.forEach(el => {
      const before = el.style[prop] || '';
      visbugBridge.setStyle(el, prop, value);
      const rec = visbugBridge.wrapElement(el);
      const edit = store.getEdit(rec.id);
      const existing = edit.configs.find(c => c.property === prop);
      if (existing) existing.value = value;
      else edit.configs.push({ property: prop, value, original: before });
      store.updateEdit(rec.id, { configs: edit.configs });
    });
  }

  onSelectionChange(records) {
    const body = this.shadowRoot.getElementById('body');
    const nameEl = this.shadowRoot.getElementById('elementName');
    const iconEl = this.shadowRoot.getElementById('elementIcon');

    if (!records.length) {
      body.style.opacity = '0.5';
      nameEl.textContent = '未选择';
      return;
    }
    body.style.opacity = '1';
    const rec = records[records.length - 1];
    const el = rec.element;
    const cs = window.getComputedStyle(el);

    nameEl.textContent = rec.identity.tag + (rec.identity.classes[0] ? '.' + rec.identity.classes[0] : '');

    // Populate all inputs
    const setVal = (id, val) => {
      const inp = this.shadowRoot.getElementById(id);
      if (inp) inp.value = val;
    };

    setVal('widthInput', cs.width === 'auto' ? 'auto' : parseInt(cs.width));
    setVal('heightInput', cs.height === 'auto' ? 'auto' : parseInt(cs.height));
    setVal('xInput', parseInt(cs.left) || 0);
    setVal('yInput', parseInt(cs.top) || 0);
    setVal('fontFamily', cs.fontFamily?.split(',')[0]?.replace(/["']/g, '') || 'Inter');
    setVal('fontSize', parseInt(cs.fontSize));
    setVal('lineHeight', parseFloat(cs.lineHeight));
    setVal('letterSpacing', parseFloat(cs.letterSpacing) || 0);
    setVal('gapInput', parseInt(cs.gap) || 0);
    setVal('paddingInput', parseInt(cs.padding) || 0);
    setVal('opacityInput', Math.round((parseFloat(cs.opacity) || 1) * 100));
    this.shadowRoot.getElementById('opacityRange').value = Math.round((parseFloat(cs.opacity) || 1) * 100);

    // Update swatches
    const fillSwatch = this.shadowRoot.getElementById('fillSwatch0');
    const fillValue = this.shadowRoot.getElementById('fillValue0');
    const fillPct = this.shadowRoot.getElementById('fillPercent0');
    if (fillSwatch) {
      const bg = cs.backgroundColor;
      fillSwatch.style.background = bg;
      fillValue.textContent = bg === 'rgba(0, 0, 0, 0)' ? 'None' : bg;
      fillPct.textContent = '100%';
    }

    // Update code tab
    const codeArea = this.shadowRoot.getElementById('codeArea');
    if (codeArea) {
      const edit = store.getEdit(rec.id);
      const css = edit.configs.map(c => `  ${c.property}: ${c.value};`).join('\n');
      codeArea.value = css || '/* No changes yet */';
    }
  }

  onPanelStateChange(sp) {
    this.applySide(sp.side);
    this.shadowRoot.getElementById('pinBtn').classList.toggle('pinned', sp.pinned);
  }

  applySide(side) {
    const panel = this.shadowRoot.getElementById('panel');
    if (side === 'left') {
      panel.style.left = '12px';
      panel.style.right = 'auto';
    } else {
      panel.style.right = '12px';
      panel.style.left = 'auto';
    }
  }

  showSnapOverlay(show) {
    const overlay = this.shadowRoot.getElementById('snapOverlay');
    if (overlay) overlay.style.display = show ? 'flex' : 'none';
  }

  updateSnapVisual(side) {
    const left = this.shadowRoot.getElementById('snapLeft');
    const right = this.shadowRoot.getElementById('snapRight');
    if (left) left.classList.toggle('active', side === 'left');
    if (right) right.classList.toggle('active', side === 'right');
  }
}
