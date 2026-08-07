# KOS 旅游获客控制台

新的 React + Vite + TypeScript 版本，使用 Tailwind CSS 和 shadcn/ui 风格组件重构。旧版单文件 HTML 不参与运行。

## 启动

```bash
npm install
npm run dev
```

## 验证

```bash
npm test -- --run
npm run build
```

## 代码结构

- `src/data`：旅游行业演示数据与流程配置
- `src/lib`：筛选等纯逻辑
- `src/components/ui`：shadcn/ui 基础组件
- `src/components/layout`：应用壳层和导航
- `src/components/overview`：经营驾驶舱
- `src/components/monitor`：破冰/意向热聊及五阶段看板
- `src/components/dialog`：游客对话与推进交互
- `src/components/advisor`：旅行顾问 1v1 工作台
- `src/components/content`：旅游内容中心
- `src/components/schedule`：跟进调度中心
- `src/components/report`：今日经营报告

当前版本包含：经营概览、渠道筛选、游客卡片详情、对话输入、推进下一阶段、旅行顾问工作台、旅游内容中心、跟进调度中心、今日报告和响应式布局。
