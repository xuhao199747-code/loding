# Liaison - AI Design & Annotation Chrome Extension

基于 VisBug 架构二次开发的 Chrome 浏览器扩展，定位为「AI 编程定位、网页样式编辑与批注」工具。

## 目录结构

```
liaison-extension/
├── manifest.json                          # 扩展清单
├── background.js                          # Service Worker
├── content.js                             # 内容脚本入口
├── content.css                            # 全局隔离样式
├── icons/                                 # 扩展图标
│
└── liaison-app/                           # 主应用目录
    ├── liaison-app.element.js             # 根容器组件
    ├── liaison-app.element.css            # 根容器样式
    │
    ├── state/
    │   ├── store.js                       # 中央状态管理 (PubSub)
    │   └── history.js                     # 撤销/重做栈管理
    │
    ├── shared/
    │   ├── utils.js                       # 颜色转换、节流防抖等工具
    │   └── serialization.js             # JSON 导入导出 / Prompt 生成
    │
    ├── visbug/
    │   └── visbug-bridge.js              # VisBug 适配层 (选择/移动/文本编辑)
    │
    ├── features/
    │   ├── selection/
    │   │   └── selectable.js              # 选区管理、Hover 框、多选框
    │   │
    │   ├── toolbar/
    │   │   ├── top-toolbar.element.js     # 顶部工具栏 (模式切换/拖拽/吸附)
    │   │   └── top-toolbar.element.css
    │   │
    │   ├── style-panel/
    │   │   ├── style-panel.element.js     # 样式编辑器 (右侧面板)
    │   │   ├── style-panel.element.css
    │   │   └── color-popover/
    │   │       ├── color-popover.element.js   # 颜色弹窗 (纯色/渐变/吸管)
    │   │       └── color-popover.element.css
    │   │
    │   ├── comments/
    │   │   ├── comment-panel.element.js   # 评论系统 (锚点/列表/批量)
    │   │   └── comment-panel.element.css
    │   │
    │   ├── page-overview/
    │   │   ├── page-overview-panel.element.js  # 配置列表 (汇总/定位/导出)
    │   │   └── page-overview-panel.element.css
    │   │
    │   └── react-dev/
    │       ├── react-dev-bridge.js        # React Fiber 读取
    │       └── react-info.element.js      # React 组件信息浮层
```

## 模块职责说明

| 模块 | 职责 |
|------|------|
| `store.js` | 全局状态容器。管理 mode、selection、edits、comments、history、UI 状态。提供 subscribe/get/set/batch API。 |
| `history.js` | 独立撤销栈。监听 `liaison-style-change` 事件，记录 before/after，支持 Ctrl+Z / Cmd+Z。 |
| `visbug-bridge.js` | 适配层。优先调用 VisBug 的 API (选择/移动/文本编辑/测量)；VisBug 不存在时降级到原生实现。同时提供 React Fiber 探测。 |
| `selectable.js` | 选区可视化。绘制 hover 虚线框和选中实线框，带标签。监听 scroll/resize 自动刷新位置。 |
| `top-toolbar` | 顶部悬浮工具栏。支持模式切换、拖拽吸附顶部/底部、收起为 pill、更多菜单、快捷键提示。 |
| `style-panel` | 右侧样式编辑器。分 Style/Code 两 tab，包含所有 CSS 字段输入、数字拖拽交互、盒模型可视化、共享元素开关。 |
| `color-popover` | 自定义颜色编辑器。SV 面板 + 色相/透明度滑杆 + 渐变 stop 编辑 + 吸管 + Hex/RGB/HSL 切换。拖动实时同步页面和输入框。 |
| `comment-panel` | 评论系统。Comment 模式下点击元素弹出内联输入；支持批量评论（一条记录关联多元素）；页面显示数字锚点；支持编辑删除。 |
| `page-overview` | 配置列表。汇总所有 edits + comments，三 tab 切换（全部/配置/评论）。支持定位、重置、复制单条 Prompt、导入导出 JSON。 |
| `react-dev` | React 开发增强。从 Fiber 读取 Component Tree、Source 文件路径、Owner Stack；无 React 时安全降级。 |
| `serialization.js` | 序列化与 Prompt 生成。导出 JSON 包含完整状态；生成 Markdown 格式 Prompt 供 AI 阅读。 |

## 样式与状态管理说明

### 状态流
```
用户交互 → Store.set() → 订阅者回调 → UI 更新 → VisBug Bridge 写回 DOM
                                    ↓
                              History.push()
```

### 样式隔离策略
- 所有 Liaison UI 使用 Shadow DOM (`attachShadow({mode:'open'})`)
- `content.css` 设置全局 `all: initial` 重置，防止页面 CSS 污染
- 固定 `z-index: 2147483647` 确保浮层在最顶层
- 浮层使用 `position: fixed` + `pointer-events` 精确控制事件穿透

### 输入框防失焦策略
- Shadow DOM 天然隔离页面事件
- 所有输入框 `keydown` 事件调用 `e.stopPropagation()`，防止被页面快捷键拦截
- Tab 键在编辑器内部循环，不跳出面板

### 固定编辑器状态
- `stylePanel.pinned` 控制是否固定
- 固定后可拖拽到左/右侧，松手自动吸附
- 拖拽时显示左右吸附提示浮层
- 打开配置列表时自动取消固定，关闭后恢复

## JSON 导出示例

```json
{
  "version": "1.0.0",
  "page": {
    "url": "https://example.com/dashboard",
    "title": "Dashboard",
    "timestamp": 1714291200000
  },
  "edits": [
    {
      "id": "liaison-abc123",
      "elementPath": "body > div.container > nav.navbar > button.btn-primary",
      "groupedElementPaths": [
        "body > div.container > nav.navbar > button.btn-primary",
        "body > div.container > section.hero > button.btn-primary"
      ],
      "label": "Primary Button",
      "heading": "Navbar CTA",
      "identity": {
        "tag": "button",
        "id": "",
        "classes": ["btn-primary"],
        "testId": null
      },
      "text": "Get Started",
      "frame": {
        "x": 120,
        "y": 24,
        "width": 120,
        "height": 40
      },
      "source": {
        "fileName": "/src/components/Button.tsx",
        "lineNumber": 42,
        "columnNumber": 8
      },
      "reactComponentTree": {
        "name": "Button",
        "key": null,
        "source": { "fileName": "/src/components/Button.tsx", "lineNumber": 42 },
        "children": [
          { "name": "span", "children": [] }
        ]
      },
      "styleText": "background: #6366f1; color: #fff; border-radius: 8px;",
      "managedData": {
        "textColorConfig": {
          "hex": "#ffffff",
          "opacity": 100
        },
        "fillLayer0Config": {
          "mode": "gradient",
          "hex": null,
          "opacity": 100,
          "angle": 135,
          "stops": [
            { "hex": "#6366f1", "opacity": 100, "position": 0 },
            { "hex": "#ec4899", "opacity": 100, "position": 100 }
          ],
          "preview": "linear-gradient(135deg, #6366f1 0%, #ec4899 100%)"
        },
        "shadowLayer0ColorConfig": {
          "hex": "#000000",
          "opacity": 15
        }
      },
      "configs": [
        { "property": "background", "value": "linear-gradient(135deg, #6366f1, #ec4899)", "original": "#4f46e5" },
        { "property": "borderRadius", "value": "12px", "original": "8px" },
        { "property": "padding", "value": "12px 24px", "original": "8px 16px" }
      ],
      "comments": [],
      "feedback": "按钮需要更突出的渐变背景，圆角加大"
    }
  ],
  "comments": [
    {
      "targetId": "batch-a1b2c3",
      "isBatch": true,
      "groupedElementPaths": [
        "body > main > section.features > div.card:nth-child(1)",
        "body > main > section.features > div.card:nth-child(2)",
        "body > main > section.features > div.card:nth-child(3)"
      ],
      "items": [
        {
          "id": "cmt-001",
          "text": "三张卡片统一增加 16px 间距，阴影统一为柔和风格",
          "author": "You",
          "timestamp": 1714291300000,
          "resolved": false
        }
      ]
    }
  ],
  "sharedElements": [
    ["button.btn-primary", { "enabled": true, "ids": ["liaison-abc123", "liaison-def456"] }]
  ],
  "meta": {
    "exportedAt": 1714291400000,
    "tool": "Liaison"
  }
}
```

## Prompt 导出示例

```markdown
# Liaison Design Feedback: Dashboard
URL: https://example.com/dashboard
Exported: 2025/04/28 14:20:00

## Page Feedback
整体色调偏冷，建议主按钮使用更温暖的渐变。

## Targets (1)

### Primary Button [liaison-abc123]
- **Path**: body > div.container > nav.navbar > button.btn-primary
- **Shared with**: body > div.container > section.hero > button.btn-primary
- **Text**: "Get Started"
- **Frame**: {"x":120,"y":24,"width":120,"height":40}
- **Source**: /src/components/Button.tsx:42
- **React Tree**: {"name":"Button","children":[{"name":"span"}]}
- **Style Changes**:
  - background: linear-gradient(135deg, #6366f1, #ec4899) (was #4f46e5)
  - borderRadius: 12px (was 8px)
  - padding: 12px 24px (was 8px 16px)
- **Colors**:
  - textColorConfig: #ffffff @ 100%
  - fillLayer0Config: gradient (2 stops, angle 135°)
  - shadowLayer0ColorConfig: #000000 @ 15%
- **Feedback**: 按钮需要更突出的渐变背景，圆角加大

### 📦 批量评论 [batch-a1b2c3]
- **作用于**: 3 个元素
- **Comments**:
  - [You] 三张卡片统一增加 16px 间距，阴影统一为柔和风格
```

## 如何基于 VisBug 复用底层能力

### 1. 元素选择
```js
// VisBug 已注入时，直接复用其 selected 属性
if (window.visbug?.selected) {
  return window.visbug.selected.map(el => wrapElement(el));
}
// 降级：Liaison 自己维护 data-liaison-selected 标记
```

### 2. 测量与 Guides
```js
// VisBug 提供 showDistance API
if (this.visbug?.showDistance) {
  this.visbug.showDistance(fromEl, toEl);
  return;
}
// 降级：Liaison 绘制 SVG 标尺线
```

### 3. 元素移动与自动布局
```js
// VisBug 的 move 支持自动布局感知
if (this.visbug?.move) {
  this.visbug.move(el, dx, dy);
  return;
}
// 降级：直接修改 style.left / style.top
```

### 4. 文本编辑
```js
// VisBug 提供 editText 可自动处理 contentEditable
if (this.visbug?.editText) {
  this.visbug.editText(el);
  return;
}
// 降级：手动设置 contentEditable + blur 监听
```

### 5. 样式写回
```js
// 统一通过 visbugBridge.setStyle() 写入
// 内部触发 liaison-style-change 事件，自动进入 History 栈
visbugBridge.setStyle(el, 'background', '#6366f1');
```

### 6. 架构关系图
```
┌─────────────────────────────────────────────┐
│               Liaison UI Layer               │
│  ┌─────────┐ ┌──────────┐ ┌──────────────┐  │
│  │ Toolbar │ │ Style    │ │ Comment/     │  │
│  │         │ │ Panel    │ │ Overview     │  │
│  └────┬────┘ └────┬─────┘ └──────┬───────┘  │
│       └─────────────┴──────────────┘          │
│                    ↓                          │
│              Store (PubSub)                   │
│                    ↓                          │
│         ┌─────────┬──────────┐               │
│         │ History │ Selection│               │
│         └────┬────┴─────┬────┘               │
│              ↓          ↓                    │
│     ┌────────┴──────────┐                   │
│     │   VisBug Bridge   │                   │
│     │  ┌─────────────┐  │                   │
│     │  │ VisBug API  │  │ ← 优先复用       │
│     │  │ (if present)│  │                   │
│     │  └─────────────┘  │                   │
│     │  ┌─────────────┐  │                   │
│     │  │ Native      │  │ ← 降级方案       │
│     │  │ Fallback    │  │                   │
│     │  └─────────────┘  │                   │
│     └───────────────────┘                   │
│                    ↓                          │
│              Target Web Page                  │
└─────────────────────────────────────────────┘
```

## 开发步骤速查

1. **接管工具栏** → `top-toolbar.element.js` 跑起来，复用 VisBug 选择/标尺
2. **样式编辑器** → `style-panel.element.js` 文本/宽高/gap/padding/字体/透明度/圆角/填充/描边/投影
3. **配置列表** → `page-overview-panel.element.js` 汇总/定位/重置/复制/导入导出骨架
4. **评论系统** → `comment-panel.element.js` 单元素评论 + 批量评论 + 锚点
5. **固定编辑器** → 拖拽吸附左/右 + 状态持久化
6. **颜色编辑器** → 纯色 → 渐变 → 吸管 → 格式切换
7. **共享元素** → 开关 + 同类同步 + 配置列表聚合
8. **Prompt & React** → Page Feedback / Targets / Component Tree / Source

## 安装与运行

1. 打开 Chrome `chrome://extensions/`
2. 开启「开发者模式」
3. 点击「加载已解压的扩展程序」
4. 选择 `liaison-extension` 目录
5. 点击扩展图标或按快捷键启动 Liaison
