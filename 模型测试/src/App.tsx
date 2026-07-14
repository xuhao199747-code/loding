import { Activity, Boxes, Image, Settings2, Sparkles, Video } from 'lucide-react'

function App() {
  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand-lockup">
          <div className="brand-mark"><Sparkles size={18} /></div>
          <div>
            <div className="brand-name">Canvas AI</div>
            <div className="brand-subtitle">批量生成工作台</div>
          </div>
        </div>
        <div className="mode-tabs" role="tablist" aria-label="生成模式">
          <button className="mode-tab active" role="tab"><Image size={15} />生图</button>
          <button className="mode-tab" role="tab"><Video size={15} />生视频</button>
        </div>
        <div className="topbar-spacer" />
        <div className="run-status"><span className="status-dot" />离线演示</div>
        <div className="balance-pill"><Activity size={14} />本地模式</div>
        <button className="icon-button" aria-label="打开 API 设置"><Settings2 size={17} /></button>
      </header>
      <main className="workspace">
        <aside className="config-panel">
          <div className="panel-placeholder">
            <div className="placeholder-icon"><Boxes size={20} /></div>
            <h1>配置生成任务</h1>
            <p>提示词、参考素材与模型参数将在这里集中管理。</p>
          </div>
        </aside>
        <section className="queue-panel">
          <div className="queue-header">
            <div>
              <div className="eyebrow">WORKSPACE / QUEUE</div>
              <h2>任务队列</h2>
            </div>
            <div className="queue-metrics"><span>全部 <b>0</b></span><span>成功 <b>0</b></span><span>进行中 <b>0</b></span></div>
          </div>
          <div className="queue-empty">
            <div className="empty-orbit"><Sparkles size={26} /></div>
            <h3>准备开始你的第一批创作</h3>
            <p>在左侧输入提示词，选择模型后即可一次生成多组结果。</p>
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
