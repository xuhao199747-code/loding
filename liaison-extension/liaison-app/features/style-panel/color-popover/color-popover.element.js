// liaison-app/features/style-panel/color-popover/color-popover.element.js
import { store } from '../../../state/store.js';
import { hexToRgb, rgbToHex, rgbToHsl, hslToRgb, clamp, parseColor } from '../../../shared/utils.js';

export class LiaisonColorPopover extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.state = {
      mode: 'solid',
      r: 99, g: 102, b: 241, a: 1,
      h: 239, s: 85, l: 67,
      angle: 90,
      stops: [
        { r: 99, g: 102, b: 241, a: 1, position: 0 },
        { r: 236, g: 72, b: 153, a: 1, position: 100 }
      ],
      activeStopIndex: 0,
      format: 'hex'
    };
    this.isDraggingSV = false;
    this.isDraggingHue = false;
    this.isDraggingAlpha = false;
    this.isDraggingStop = false;
  }

  connectedCallback() {
    this.render();
    this.bindEvents();
    window.addEventListener('liaison-open-color', (e) => this.open(e.detail));
  }

  render() {
    const url = chrome.runtime.getURL('liaison-app/features/style-panel/color-popover/color-popover.element.css');
    this.shadowRoot.innerHTML = `
      <link rel="stylesheet" href="${url}">
      <div class="popover" id="popover" style="display:none">
        <!-- Top bar: mode toggle + close -->
        <div class="popover-topbar">
          <div class="mode-segmented">
            <button class="seg-btn active" data-mode="solid">Solid</button>
            <button class="seg-btn" data-mode="gradient">Gradient</button>
          </div>
          <button class="close-btn" id="closeBtn">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <!-- Color preview strip -->
        <div class="preview-strip" id="previewStrip"></div>

        <!-- SV Area -->
        <div class="sv-area" id="svArea">
          <div class="sv-cursor" id="svCursor"></div>
        </div>

        <!-- Sliders -->
        <div class="slider-group">
          <div class="hue-track" id="hueTrack">
            <div class="slider-thumb" id="hueThumb"></div>
          </div>
          <div class="alpha-track" id="alphaTrack">
            <div class="checker-bg"></div>
            <div class="alpha-fill" id="alphaFill"></div>
            <div class="slider-thumb" id="alphaThumb"></div>
          </div>
        </div>

        <!-- Gradient stops -->
        <div class="stops-area" id="stopsArea" style="display:none">
          <div class="stops-bar" id="stopsBar"></div>
          <button class="stop-add" id="addStop">+</button>
        </div>

        <!-- Value input row -->
        <div class="value-row">
          <div class="swatch-preview" id="swatchPreview"></div>
          <button class="format-btn" id="formatBtn">HEX</button>
          <input type="text" class="value-input" id="valueInput" value="#6366F1" />
          <div class="pct-wrap">
            <input type="number" class="pct-input" id="pctInput" value="100" min="0" max="100" />
            <span>%</span>
          </div>
        </div>

        <!-- Gradient angle -->
        <div class="angle-row" id="angleRow" style="display:none">
          <span class="angle-label">Angle</span>
          <input type="number" class="angle-input" id="angleInput" value="90" />
          <span class="angle-deg">°</span>
        </div>

        <!-- Eyedropper -->
        <button class="eyedropper-btn" id="eyedropperBtn">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 11l-8-8-8.6 8.6a2 2 0 0 0 0 2.8l5.2 5.2c.8.8 2 .8 2.8 0L19 11z"/><path d="M15 7l3 3"/><path d="M2 20l4-1 1 4"/></svg>
          Pick color
        </button>
      </div>
    `;
  }

  bindEvents() {
    const popover = this.shadowRoot.getElementById('popover');
    const svArea = this.shadowRoot.getElementById('svArea');
    const hueTrack = this.shadowRoot.getElementById('hueTrack');
    const alphaTrack = this.shadowRoot.getElementById('alphaTrack');

    // Mode tabs
    this.shadowRoot.querySelectorAll('.seg-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.state.mode = btn.dataset.mode;
        this.shadowRoot.querySelectorAll('.seg-btn').forEach(t => t.classList.toggle('active', t.dataset.mode === this.state.mode));
        this.shadowRoot.getElementById('stopsArea').style.display = this.state.mode === 'gradient' ? 'flex' : 'none';
        this.shadowRoot.getElementById('angleRow').style.display = this.state.mode === 'gradient' ? 'flex' : 'none';
        this.updateUI();
      });
    });

    this.shadowRoot.getElementById('closeBtn').addEventListener('click', () => this.close());

    // SV drag
    svArea.addEventListener('mousedown', (e) => { this.isDraggingSV = true; this.updateSVFromMouse(e); });

    // Hue drag
    hueTrack.addEventListener('mousedown', (e) => { this.isDraggingHue = true; this.updateHueFromMouse(e); });

    // Alpha drag
    alphaTrack.addEventListener('mousedown', (e) => { this.isDraggingAlpha = true; this.updateAlphaFromMouse(e); });

    document.addEventListener('mousemove', (e) => {
      if (this.isDraggingSV) this.updateSVFromMouse(e);
      if (this.isDraggingHue) this.updateHueFromMouse(e);
      if (this.isDraggingAlpha) this.updateAlphaFromMouse(e);
      if (this.isDraggingStop) this.updateStopFromMouse(e);
    });

    document.addEventListener('mouseup', () => {
      this.isDraggingSV = false;
      this.isDraggingHue = false;
      this.isDraggingAlpha = false;
      this.isDraggingStop = false;
    });

    // Format toggle
    this.shadowRoot.getElementById('formatBtn').addEventListener('click', () => {
      const formats = ['hex', 'rgb', 'hsl'];
      const idx = formats.indexOf(this.state.format);
      this.state.format = formats[(idx + 1) % formats.length];
      this.updateInputValue();
    });

    // Manual input
    this.shadowRoot.getElementById('valueInput').addEventListener('change', (e) => {
      const parsed = parseColor(e.target.value);
      if (parsed) {
        this.state.r = parsed.r; this.state.g = parsed.g; this.state.b = parsed.b; this.state.a = parsed.a;
        this.syncHslFromRgb();
        this.updateUI();
        this.emitColor();
      }
    });

    // Percentage
    this.shadowRoot.getElementById('pctInput').addEventListener('change', (e) => {
      this.state.a = clamp(parseInt(e.target.value) || 0, 0, 100) / 100;
      this.updateUI();
      this.emitColor();
    });

    // Angle
    this.shadowRoot.getElementById('angleInput').addEventListener('change', (e) => {
      this.state.angle = parseInt(e.target.value) || 0;
      this.emitColor();
    });

    // Add stop
    this.shadowRoot.getElementById('addStop').addEventListener('click', () => {
      const last = this.state.stops[this.state.stops.length - 1];
      this.state.stops.push({ ...last, position: Math.min(last.position + 20, 100) });
      this.renderStops();
    });

    // Eyedropper
    this.shadowRoot.getElementById('eyedropperBtn').addEventListener('click', async () => {
      if (!window.EyeDropper) { alert('浏览器不支持吸管'); return; }
      try {
        const result = await new window.EyeDropper().open();
        const rgb = hexToRgb(result.sRGBHex);
        if (rgb) { this.state.r = rgb.r; this.state.g = rgb.g; this.state.b = rgb.b; this.state.a = 1; this.syncHslFromRgb(); this.updateUI(); this.emitColor(); }
      } catch {}
    });
  }

  open({ targetField, colorType, anchor }) {
    this.targetField = targetField;
    this.colorType = colorType;
    const popover = this.shadowRoot.getElementById('popover');
    popover.style.display = 'block';

    const rect = anchor.getBoundingClientRect();
    let left = rect.left - 20;
    let top = rect.bottom + 8;
    if (left + 240 > window.innerWidth) left = window.innerWidth - 250;
    if (top + 360 > window.innerHeight) top = rect.top - 370;
    if (top < 10) top = 10;
    popover.style.left = left + 'px';
    popover.style.top = top + 'px';

    const selected = store.get('selectedElements');
    if (selected.length) {
      const el = selected[0].element;
      const cs = window.getComputedStyle(el);
      let raw = '';
      if (colorType === 'text') raw = cs.color;
      else if (colorType === 'fill') raw = cs.backgroundColor;
      else if (colorType === 'stroke') raw = cs.borderColor;
      else if (colorType === 'shadow') raw = cs.boxShadow;
      const parsed = parseColor(raw);
      if (parsed) { this.state.r = parsed.r; this.state.g = parsed.g; this.state.b = parsed.b; this.state.a = parsed.a; this.syncHslFromRgb(); }
    }
    this.updateUI();
  }

  close() { this.shadowRoot.getElementById('popover').style.display = 'none'; }

  updateSVFromMouse(e) {
    const svArea = this.shadowRoot.getElementById('svArea');
    const rect = svArea.getBoundingClientRect();
    const x = clamp((e.clientX - rect.left) / rect.width, 0, 1);
    const y = clamp(1 - (e.clientY - rect.top) / rect.height, 0, 1);
    this.state.s = Math.round(x * 100);
    this.state.l = Math.round(y * 100);
    const rgb = hslToRgb(this.state.h, this.state.s, this.state.l);
    this.state.r = rgb.r; this.state.g = rgb.g; this.state.b = rgb.b;
    this.updateUI();
    this.emitColor();
  }

  updateHueFromMouse(e) {
    const hueTrack = this.shadowRoot.getElementById('hueTrack');
    const rect = hueTrack.getBoundingClientRect();
    const x = clamp((e.clientX - rect.left) / rect.width, 0, 1);
    this.state.h = Math.round(x * 360);
    const rgb = hslToRgb(this.state.h, this.state.s, this.state.l);
    this.state.r = rgb.r; this.state.g = rgb.g; this.state.b = rgb.b;
    this.updateUI();
    this.emitColor();
  }

  updateAlphaFromMouse(e) {
    const alphaTrack = this.shadowRoot.getElementById('alphaTrack');
    const rect = alphaTrack.getBoundingClientRect();
    const x = clamp((e.clientX - rect.left) / rect.width, 0, 1);
    this.state.a = Math.round(x * 100) / 100;
    this.updateUI();
    this.emitColor();
  }

  syncHslFromRgb() {
    const hsl = rgbToHsl(this.state.r, this.state.g, this.state.b);
    this.state.h = hsl.h; this.state.s = hsl.s; this.state.l = hsl.l;
  }

  updateUI() {
    const { h, s, l, a, r, g, b } = this.state;
    const svCursor = this.shadowRoot.getElementById('svCursor');
    svCursor.style.left = (s / 100 * 100) + '%';
    svCursor.style.bottom = (l / 100 * 100) + '%';
    svCursor.style.background = `rgb(${r},${g},${b})`;

    this.shadowRoot.getElementById('hueThumb').style.left = (h / 360 * 100) + '%';
    this.shadowRoot.getElementById('alphaThumb').style.left = (a * 100) + '%';
    this.shadowRoot.getElementById('alphaFill').style.width = (a * 100) + '%';

    const preview = this.shadowRoot.getElementById('swatchPreview');
    const strip = this.shadowRoot.getElementById('previewStrip');
    if (this.state.mode === 'solid') {
      const color = `rgba(${r},${g},${b},${a})`;
      preview.style.background = color;
      strip.style.background = color;
    } else {
      const grad = this.buildGradientString();
      preview.style.background = grad;
      strip.style.background = grad;
    }

    this.updateInputValue();
    this.renderStops();
  }

  updateInputValue() {
    const { r, g, b, a, h, s, l } = this.state;
    let val = '';
    if (this.state.format === 'hex') {
      val = rgbToHex(r, g, b);
      if (a < 1) val += Math.round(a * 255).toString(16).padStart(2, '0');
    } else if (this.state.format === 'rgb') {
      val = a < 1 ? `rgba(${r},${g},${b},${a})` : `rgb(${r},${g},${b})`;
    } else {
      val = a < 1 ? `hsla(${h},${s}%,${l}%,${a})` : `hsl(${h},${s}%,${l}%)`;
    }
    this.shadowRoot.getElementById('valueInput').value = val;
    this.shadowRoot.getElementById('formatBtn').textContent = this.state.format.toUpperCase();
    this.shadowRoot.getElementById('pctInput').value = Math.round(a * 100);
  }

  renderStops() {
    const bar = this.shadowRoot.getElementById('stopsBar');
    bar.innerHTML = '';
    const gradPreview = this.state.stops.map(st =>
      `rgba(${st.r},${st.g},${st.b},${st.a}) ${st.position}%`
    ).join(', ');
    bar.style.background = `linear-gradient(90deg, ${gradPreview})`;

    this.state.stops.forEach((stop, i) => {
      const thumb = document.createElement('div');
      thumb.className = 'stop-thumb' + (i === this.state.activeStopIndex ? ' active' : '');
      thumb.style.left = stop.position + '%';
      thumb.style.background = `rgba(${stop.r},${stop.g},${stop.b},${stop.a})`;
      thumb.addEventListener('mousedown', (e) => {
        e.stopPropagation();
        this.state.activeStopIndex = i;
        this.isDraggingStop = true;
        this.renderStops();
      });
      thumb.addEventListener('dblclick', () => {
        if (this.state.stops.length > 2) {
          this.state.stops.splice(i, 1);
          this.state.activeStopIndex = 0;
          this.renderStops();
          this.emitColor();
        }
      });
      bar.appendChild(thumb);
    });
  }

  updateStopFromMouse(e) {
    const bar = this.shadowRoot.getElementById('stopsBar');
    const rect = bar.getBoundingClientRect();
    const x = clamp((e.clientX - rect.left) / rect.width, 0, 1);
    const stop = this.state.stops[this.state.activeStopIndex];
    stop.position = Math.round(x * 100);
    stop.r = this.state.r; stop.g = this.state.g; stop.b = this.state.b; stop.a = this.state.a;
    this.renderStops();
    this.emitColor();
  }

  buildGradientString() {
    const stops = this.state.stops.map(s =>
      `rgba(${s.r},${s.g},${s.b},${s.a}) ${s.position}%`
    ).join(', ');
    return `linear-gradient(${this.state.angle}deg, ${stops})`;
  }

  emitColor() {
    let value = '';
    if (this.state.mode === 'solid') {
      const { r, g, b, a } = this.state;
      value = a < 1 ? `rgba(${r},${g},${b},${a})` : rgbToHex(r, g, b);
    } else {
      value = 'gradient:' + JSON.stringify({
        mode: 'gradient', angle: this.state.angle,
        stops: this.state.stops.map(s => ({
          hex: rgbToHex(s.r, s.g, s.b), opacity: Math.round(s.a * 100), position: s.position
        }))
      });
    }
    window.dispatchEvent(new CustomEvent('liaison-color-picked', {
      detail: { targetField: this.targetField, colorType: this.colorType, value, state: { ...this.state } }
    }));
  }
}

if (!customElements.get('liaison-color-popover')) {
  customElements.define('liaison-color-popover', LiaisonColorPopover);
}
