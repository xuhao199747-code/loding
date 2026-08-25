# 光流动画编辑器

一个基于 React 的静态网页工具，用于创建、编辑和预览光流动画画布。项目以纯前端方式运行，可通过 Vercel 直接发布为在线应用。

在线访问：https://loding-five.vercel.app

## 本地运行

```bash
python3 -m http.server 5173 -d app
```

访问：

```text
http://localhost:5173
```

## 发布

项目通过 Vercel 发布，构建命令会将 `app/` 复制到 `dist/`：

```bash
npm run build
```
