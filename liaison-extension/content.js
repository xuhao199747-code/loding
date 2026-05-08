// content.js - Main entry point
(async () => {
  console.log('[Liaison] Content script starting...');

  if (window.__liaison_initialized) {
    console.log('[Liaison] Already initialized, skipping');
    return;
  }

  // Diagnostic indicator so user can see if content script is alive
  const indicator = document.createElement('div');
  indicator.id = '__liaison-indicator';
  indicator.textContent = 'Liaison loading...';
  indicator.style.cssText = 'position:fixed;top:10px;right:10px;z-index:999999999;background:#6366f1;color:#fff;padding:8px 12px;border-radius:4px;font-family:sans-serif;font-size:12px;max-width:300px;word-break:break-word;';
  if (document.body) {
    document.body.appendChild(indicator);
  } else {
    document.addEventListener('DOMContentLoaded', () => document.body.appendChild(indicator));
  }

  try {
    // Load VisBug if present, or stub
    const visbugReady = await ensureVisBug();
    console.log('[Liaison] VisBug ready:', visbugReady);

    // Check if customElements API is available
    const registry = window.customElements || globalThis.customElements;
    console.log('[Liaison] customElements registry:', registry, 'window.customElements:', window.customElements);

    if (!registry) {
      // Fallback: customElements not available, use plain DOM
      console.warn('[Liaison] customElements unavailable, using plain DOM fallback');
      const fallbackApp = createFallbackApp();
      document.body.appendChild(fallbackApp);
      window.__liaison_app = fallbackApp;
      window.__liaison_initialized = true;
      indicator.textContent = 'Liaison ready (fallback mode)';
      indicator.style.background = '#f59e0b';
      setTimeout(() => indicator.remove(), 3000);
      console.log('[Liaison] Fallback app mounted');
      return;
    }

    // Import Liaison modules
    const moduleUrl = chrome.runtime.getURL('liaison-app/liaison-app.element.js');
    console.log('[Liaison] Importing from:', moduleUrl);

    const { LiaisonAppElement } = await import(moduleUrl);
    console.log('[Liaison] Module loaded:', LiaisonAppElement);

    registry.define('liaison-app', LiaisonAppElement);
    console.log('[Liaison] Custom element defined');

    const app = document.createElement('liaison-app');
    app.style.display = 'none'; // Start hidden, toggle to show
    document.body.appendChild(app);
    window.__liaison_app = app;
    window.__liaison_initialized = true;

    indicator.textContent = 'Liaison ready (click extension icon)';
    indicator.style.background = '#22c55e';
    setTimeout(() => indicator.remove(), 3000);
    console.log('[Liaison] App mounted to body, ready to toggle');
  } catch (err) {
    indicator.textContent = 'Liaison error: ' + err.message;
    indicator.style.background = '#ef4444';
    console.error('[Liaison] Failed to initialize:', err);
  }

  function ensureVisBug() {
    return new Promise((resolve) => {
      if (window.visbug || document.querySelector('vis-bug')) {
        resolve(true);
        return;
      }
      resolve(false);
    });
  }

  function createFallbackApp() {
    const root = document.createElement('div');
    root.id = 'liaison-app';
    root.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:2147483646;display:none;pointer-events:none;font-family:"Inter",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;';

    const toolbar = document.createElement('div');
    toolbar.style.cssText = 'position:fixed;top:12px;left:50%;transform:translateX(-50%);background:#1e1e2e;color:#fff;padding:8px 16px;border-radius:8px;display:flex;gap:12px;align-items:center;pointer-events:auto;box-shadow:0 4px 20px rgba(0,0,0,0.3);font-size:13px;white-space:nowrap;';
    toolbar.innerHTML = `
      <span style="font-weight:600;color:#818cf8">Liaison</span>
      <span style="color:#6b7280">|</span>
      <span style="color:#9ca3af">Design</span>
      <span style="color:#9ca3af">Guides</span>
      <span style="color:#9ca3af">Comment</span>
    `;

    const panel = document.createElement('div');
    panel.style.cssText = 'position:fixed;top:60px;right:16px;width:260px;background:#1e1e2e;color:#fff;border-radius:8px;padding:16px;pointer-events:auto;box-shadow:0 4px 20px rgba(0,0,0,0.3);font-size:13px;';
    panel.innerHTML = `
      <div style="font-weight:600;margin-bottom:12px;color:#818cf8">Style Panel</div>
      <div style="color:#9ca3af;font-size:12px;line-height:1.6">
        Fallback mode active.<br>
        customElements API unavailable.<br>
        Full features require standard Chrome.
      </div>
    `;

    root.appendChild(toolbar);
    root.appendChild(panel);

    root.toggle = function() {
      this.style.display = this.style.display === 'none' ? 'block' : 'none';
    };

    return root;
  }
})();

// Listen for toggle messages from background.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('[Liaison] Received message:', request);

  if (request.type === 'TOGGLE_LIAISON') {
    if (window.__liaison_app) {
      try {
        window.__liaison_app.toggle();
        const active = window.__liaison_app.style.display !== 'none';
        console.log('[Liaison] Toggled, active:', active);
        sendResponse({ success: true, active });
      } catch (err) {
        console.error('[Liaison] Toggle failed:', err);
        sendResponse({ success: false, error: err.message });
      }
    } else {
      console.warn('[Liaison] App not ready yet');
      sendResponse({ success: false, error: 'App not initialized' });
    }
    return true;
  }
});
