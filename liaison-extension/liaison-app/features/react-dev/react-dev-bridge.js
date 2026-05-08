// liaison-app/features/react-dev/react-dev-bridge.js
/**
 * React development environment enhancement.
 * Reads React Fiber tree, source info, component names.
 * Gracefully degrades if React DevTools not present.
 */

export class ReactDevBridge {
  constructor() {
    this.hook = window.__REACT_DEVTOOLS_GLOBAL_HOOK__;
    this.renderer = null;
    this.detectRenderer();
  }

  detectRenderer() {
    if (!this.hook) return;
    const renderers = this.hook.renderers;
    if (!renderers) return;
    // Get the first renderer (usually React DOM)
    const keys = Array.from(renderers.keys());
    if (keys.length > 0) {
      this.renderer = renderers.get(keys[0]);
    }
  }

  isAvailable() {
    return !!this.renderer;
  }

  getFiberForElement(el) {
    if (!el) return null;
    const key = Object.keys(el).find(k =>
      k.startsWith('__reactFiber$') || k.startsWith('__reactInternalInstance$')
    );
    return key ? el[key] : null;
  }

  getComponentTree(el, maxDepth = 5) {
    const fiber = this.getFiberForElement(el);
    if (!fiber) return null;
    return this.buildTreeNode(fiber, 0, maxDepth);
  }

  buildTreeNode(fiber, depth, maxDepth) {
    if (!fiber || depth > maxDepth) return null;

    const type = fiber.type;
    let name = 'Unknown';
    if (typeof type === 'string') name = type;
    else if (type?.displayName) name = type.displayName;
    else if (type?.name) name = type.name;
    else if (type) name = 'Component';

    const node = {
      name,
      key: fiber.key || null,
      source: fiber._debugSource || null,
      selfTime: fiber.actualDuration || null,
      children: []
    };

    // Walk up to ancestors
    let child = fiber.child;
    while (child && node.children.length < 10) {
      const childNode = this.buildTreeNode(child, depth + 1, maxDepth);
      if (childNode) node.children.push(childNode);
      child = child.sibling;
    }

    return node;
  }

  getSourceInfo(el) {
    const fiber = this.getFiberForElement(el);
    if (fiber?._debugSource) {
      return {
        fileName: fiber._debugSource.fileName,
        lineNumber: fiber._debugSource.lineNumber,
        columnNumber: fiber._debugSource.columnNumber
      };
    }
    return null;
  }

  getOwnerStack(el) {
    const fiber = this.getFiberForElement(el);
    if (!fiber) return [];
    const stack = [];
    let current = fiber._debugOwner;
    while (current && stack.length < 10) {
      const type = current.type;
      let name = 'Unknown';
      if (typeof type === 'string') name = type;
      else if (type?.displayName) name = type.displayName;
      else if (type?.name) name = type.name;
      stack.push({
        name,
        source: current._debugSource || null
      });
      current = current._debugOwner;
    }
    return stack;
  }

  // Format tree for prompt output
  formatTreeForPrompt(tree, indent = 0) {
    if (!tree) return '';
    const prefix = '  '.repeat(indent);
    let lines = [`${prefix}- ${tree.name}${tree.source ? ` (${tree.source.fileName}:${tree.source.lineNumber})` : ''}`];
    tree.children.forEach(child => {
      lines.push(this.formatTreeForPrompt(child, indent + 1));
    });
    return lines.join('\n');
  }
}

export const reactDevBridge = new ReactDevBridge();
