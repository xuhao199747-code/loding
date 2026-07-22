# AsciiGlitchBackground

独立版背景组件，包含：

- `AsciiGlitchBackground.tsx`
- `ascii-glitch-background.css`
- `ascii-background.txt`

用法：

```tsx
import { AsciiGlitchBackground } from "./AsciiGlitchBackground"

export function Page() {
  return (
    <main style={{ position: "relative", minHeight: 720 }}>
      <AsciiGlitchBackground />
      <div style={{ position: "relative", zIndex: 1 }}>
        Your content
      </div>
    </main>
  )
}
```

要求：构建工具需要支持 `?raw` 文本导入，Vite 默认支持。
