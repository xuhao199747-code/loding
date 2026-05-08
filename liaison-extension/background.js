// background.js - Service Worker
chrome.runtime.onInstalled.addListener(() => {
  console.log('[Liaison] Extension installed');
});

chrome.action.onClicked.addListener(async (tab) => {
  console.log('[Liaison] Action clicked, tab:', tab?.id, tab?.url);
  if (!tab?.id) {
    console.warn('[Liaison] No tab ID');
    return;
  }

  // Skip chrome:// and other restricted URLs where content scripts can't run
  if (tab.url?.startsWith('chrome://') || tab.url?.startsWith('chrome-extension://') || tab.url?.startsWith('devtools://')) {
    console.warn('[Liaison] Cannot run on restricted URL:', tab.url);
    return;
  }

  try {
    const response = await chrome.tabs.sendMessage(tab.id, { type: 'TOGGLE_LIAISON' });
    console.log('[Liaison] Toggle response:', response);
    if (!response?.success && response?.error === 'App not initialized') {
      // Content script is there but app failed to load, try injecting again
      console.log('[Liaison] App not initialized, re-injecting...');
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['content.js']
      });
      await new Promise(r => setTimeout(r, 600));
      const retryResponse = await chrome.tabs.sendMessage(tab.id, { type: 'TOGGLE_LIAISON' });
      console.log('[Liaison] Toggle after re-inject:', retryResponse);
    }
  } catch (err) {
    // Content script not present on this tab (page opened before extension loaded)
    console.log('[Liaison] Content script not present, injecting now...');
    try {
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['content.js']
      });
      console.log('[Liaison] Content script injected, waiting for init...');
      // Give content script time to initialize before sending toggle
      await new Promise(r => setTimeout(r, 600));
      try {
        const response = await chrome.tabs.sendMessage(tab.id, { type: 'TOGGLE_LIAISON' });
        console.log('[Liaison] Toggle after inject:', response);
      } catch (toggleErr) {
        console.error('[Liaison] Toggle after inject failed:', toggleErr.message);
      }
    } catch (injectErr) {
      console.error('[Liaison] Failed to inject content script:', injectErr.message);
    }
  }
});
