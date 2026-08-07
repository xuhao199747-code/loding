# KOS UI Interaction Enhancements Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Improve the existing single-file KOS demo's interaction feedback without changing its page structure, tourism content, responsive layout, or navigation architecture.

**Architecture:** Keep the outer shell and embedded base64 iframe views. Add small, self-contained CSS/JavaScript overrides to the outer shell and decoded home/monitor/dialog templates, using existing postMessage navigation and DOM event patterns.

**Tech Stack:** Standalone HTML, CSS, vanilla JavaScript, iframe `srcdoc`, `postMessage`.

## Global Constraints

- Modify only `/Users/mac/Library/Containers/com.tencent.xinWeChat/Data/Documents/xwechat_files/xh961407086_49fd/msg/file/2026-08/KOS全流程整合demo_20260426_0808 (3)(2).html` and a recoverable backup.
- Preserve existing tourism copy, desktop density rules, responsive breakpoints, iframe structure, and existing route message names.
- Do not add external dependencies or network calls.
- Every new action must provide visible feedback using existing toast, active, selected, or loading patterns.

### Task 1: Shell navigation feedback

**Files:**
- Modify: `/Users/mac/Library/Containers/com.tencent.xinWeChat/Data/Documents/xwechat_files/xh961407086_49fd/msg/file/2026-08/KOS全流程整合demo_20260426_0808 (3)(2).html`

**Interfaces:**
- Consumes: existing `.kos-master-sidebar .item` click handler and `showToast(text, ms)`.
- Produces: focus-visible styling, active press state, and a short loading state on iframe view switches.

- [ ] Add shell CSS for `:focus-visible`, `.is-pressing`, and `.is-loading` states.
- [ ] Update the existing navigation click handler to add `.is-pressing`, call `showView(v)`, and remove the class after 180ms.
- [ ] Show `showToast('正在打开…')` only for a view that was not already loaded, then let existing load completion remove the loading state.

### Task 2: Home dashboard interactions

**Files:**
- Modify: same single-file HTML, decoded `home` template before re-encoding.

**Interfaces:**
- Consumes: existing `window.parent.postMessage({type:'kos-nav', ...})` bridge and home DOM selectors `.w-card`, `.fstage`, `.note`.
- Produces: clickable KPI cards, funnel-stage selection, opportunity detail expansion, and toast feedback.

- [ ] Add `tabindex="0"` and `role="button"` to `.w-card`, `.fstage`, and `.note` elements through JavaScript initialization.
- [ ] On KPI click, toggle `.is-selected` and show the card label in the existing parent toast.
- [ ] On funnel-stage click, keep only one `.is-selected` stage and update a small `#funnelHint` line; create it if absent directly under `.cust-top`.
- [ ] On opportunity-card click, toggle `.is-expanded` and reveal the existing card detail area without changing card data.
- [ ] Add keyboard activation for Enter and Space for all three interactive card groups.

### Task 3: Monitor and dialog micro-interactions

**Files:**
- Modify: same single-file HTML, decoded `monitor` and `dialog` templates before re-encoding.

**Interfaces:**
- Consumes: existing monitor card click navigation, dialog customer selection, message composer, and toast elements.
- Produces: visible hover/focus feedback, selected lead state, send-button loading feedback, and Enter-to-send behavior.

- [ ] Add `.is-selected` styling to monitor lead cards and preserve the selected card after navigation.
- [ ] Add `aria-label` values to the dialog send and simulation controls when missing.
- [ ] Add Enter-to-send behavior that ignores Shift+Enter and does not send blank messages.
- [ ] Disable the send button for 450ms after send, then restore it and show the existing success toast.

### Task 4: Verification

**Files:**
- Verify: same single-file HTML.

- [ ] Decode all five embedded templates and compile every inline script with `vm.Script`.
- [ ] Verify the file still contains tourism terms, existing `kos-nav` and `kos-locate-customer` message types, and no external script URLs.
- [ ] Open the file in Chrome and confirm the current URL remains the same local file.
- [ ] Confirm the backup exists before reporting completion.
