// liaison-app/shared/serialization.js
/**
 * Export / Import logic for Liaison state.
 * Produces both machine-readable JSON and human-readable Prompts.
 */

import { store } from '../state/store.js';

export function exportJSON() {
  const data = store.serialize();
  return JSON.stringify(data, null, 2);
}

export function importJSON(jsonString) {
  try {
    const data = JSON.parse(jsonString);
    store.deserialize(data);
    return { success: true, count: data.edits?.length || 0 };
  } catch (e) {
    return { success: false, error: e.message };
  }
}

export function generatePrompt() {
  const data = store.serialize();
  const lines = [];

  lines.push(`# Liaison Design Feedback: ${data.page.title}`);
  lines.push(`URL: ${data.page.url}`);
  lines.push(`Exported: ${new Date(data.meta.exportedAt).toLocaleString()}`);
  lines.push('');

  // Page-level feedback
  const pageFeedback = data.edits.find(e => e.id === '__page__');
  if (pageFeedback?.feedback) {
    lines.push(`## Page Feedback`);
    lines.push(pageFeedback.feedback);
    lines.push('');
  }

  lines.push(`## Targets (${data.edits.length})`);
  lines.push('');

  data.edits.forEach(edit => {
    if (edit.id === '__page__') return;

    lines.push(`### ${edit.label || edit.heading || 'Element'} [${edit.id}]`);
    lines.push(`- **Path**: ${edit.elementPath}`);
    if (edit.groupedElementPaths?.length) {
      lines.push(`- **Shared with**: ${edit.groupedElementPaths.join(', ')}`);
    }
    if (edit.text) lines.push(`- **Text**: "${edit.text}"`);
    lines.push(`- **Frame**: ${JSON.stringify(edit.frame)}`);

    if (edit.source) {
      lines.push(`- **Source**: ${edit.source.file}:${edit.source.line}`);
    }

    if (edit.reactComponentTree) {
      lines.push(`- **React Tree**: ${JSON.stringify(edit.reactComponentTree)}`);
    }

    if (edit.configs?.length) {
      lines.push(`- **Style Changes**:`);
      edit.configs.forEach(cfg => {
        lines.push(`  - ${cfg.property}: ${cfg.value} (was ${cfg.original})`);
      });
    }

    // Color configs
    const colorKeys = Object.keys(edit.managedData).filter(k => k.includes('Color') || k.includes('fill'));
    if (colorKeys.length) {
      lines.push(`- **Colors**:`);
      colorKeys.forEach(key => {
        const c = edit.managedData[key];
        if (c.mode === 'gradient') {
          lines.push(`  - ${key}: gradient (${c.stops?.length} stops, angle ${c.angle}°)`);
        } else {
          lines.push(`  - ${key}: ${c.hex} @ ${c.opacity}%`);
        }
      });
    }

    if (edit.comments?.length) {
      lines.push(`- **Comments**:`);
      edit.comments.forEach(c => lines.push(`  - [${c.author}] ${c.text}`));
    }

    if (edit.feedback) {
      lines.push(`- **Feedback**: ${edit.feedback}`);
    }

    lines.push('');
  });

  return lines.join('\n');
}

export function generateSinglePrompt(editId) {
  const edit = store.state.edits.get(editId);
  if (!edit) return '';
  const lines = [];
  lines.push(`Apply the following change to element at ${edit.elementPath}:`);
  edit.configs?.forEach(cfg => {
    lines.push(`- ${cfg.property}: ${cfg.value}`);
  });
  if (edit.feedback) lines.push(`Note: ${edit.feedback}`);
  return lines.join('\n');
}
