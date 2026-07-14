import { ChevronDown, FileImage, ImagePlus, Info, Link2, Plus, Sparkles, Upload, X } from 'lucide-react'
import type { ChangeEvent } from 'react'
import { countPrompts } from '../lib/format'
import type { Draft, Mode, ModelDefinition } from '../types'
import { ModelPicker } from './ModelPicker'

interface Props {
  mode: Mode
  draft: Draft
  models: ModelDefinition[]
  onDraftChange: (draft: Draft) => void
  onGenerate: (input: { prompts: string[]; models: ModelDefinition[]; count: number; mode: Mode; draft: Draft }) => void
  onOpenSettings: () => void
}

const ratios = ['1:1', '16:9', '9:16', '4:3', '3:4', '21:9']
const imageResolutions = ['1K', '2K', '4K']
const videoResolutions = ['720p', '1080p', '4K']
const durations = [5, 8, 10, 15]

export function PromptPanel({ mode, draft, models, onDraftChange, onGenerate, onOpenSettings }: Props) {
  const update = (patch: Partial<Draft>) => onDraftChange({ ...draft, ...patch })
  const prompts = draft.prompt.split('\n').map(prompt => prompt.trim()).filter(Boolean)
  const selectedModels = models.filter(model => draft.selectedModelIds.includes(model.id))
  const setReferences = (references: string[]) => update({ references: [...draft.references, ...references] })

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = [...(event.target.files ?? [])]
    setReferences(files.map(file => URL.createObjectURL(file)))
    event.target.value = ''
  }

  return <aside className="config-panel">
    <div className="config-scroll">
      <div className="panel-heading"><div><div className="eyebrow">CREATE / {mode === 'image' ? 'IMAGE' : 'VIDEO'}</div><h1>配置生成任务</h1></div><button className="ghost-icon" aria-label="配置提示" title="配置提示"><Info size={15} /></button></div>

      <section className="config-section">
        <div className="section-title"><span className="section-icon purple"><Sparkles size={14} /></span><span>提示词</span><span className="count-badge">{countPrompts(draft.prompt)} 条</span><span className="section-hint">每行一条，自动批量</span></div>
        <textarea aria-label="提示词" className="prompt-textarea" value={draft.prompt} onChange={event => update({ prompt: event.target.value })} onKeyDown={event => { if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') onGenerate({ prompts, models: selectedModels, count: draft.count, mode, draft }) }} placeholder={mode === 'image' ? '输入提示词，每一行都是一条独立任务…\n\n例如：\n一只柯基穿着宇航服漫步在月球表面\n赛博朋克雨夜街头，霓虹倒映在积水中' : '描述你想生成的镜头，每一行是一条独立任务…\n\n例如：\n一列高铁穿过云海，镜头缓慢推进'} />
        <details className="advanced-field"><summary><ChevronDown size={14} />高级：负向提示词</summary><textarea aria-label="负向提示词" value={draft.negativePrompt} onChange={event => update({ negativePrompt: event.target.value })} placeholder="模糊、低画质、变形、水印…" /></details>
      </section>

      <section className="config-section">
        <div className="section-title"><span className="section-icon cyan"><FileImage size={14} /></span><span>参考素材</span><span className="optional-label">可选</span><span className="section-hint">支持拖拽 / 粘贴截图</span></div>
        <div className="reference-grid">
          {draft.references.map((reference, index) => <div className="reference-tile" key={`${reference}-${index}`}><img src={reference} alt={`参考素材 ${index + 1}`} /><button type="button" aria-label={`移除参考素材 ${index + 1}`} onClick={() => update({ references: draft.references.filter((_, itemIndex) => itemIndex !== index) })}><X size={12} /></button><span>参考 {index + 1}</span></div>)}
          <label className="reference-add"><Upload size={18} /><span>上传</span><input type="file" accept="image/png,image/jpeg,image/webp,image/gif" multiple onChange={handleFileChange} /></label>
          <button type="button" className="reference-add paste-reference" onClick={() => setReferences(['data:image/svg+xml;charset=utf-8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="240" height="180"><rect width="240" height="180" fill="#202b4f"/><circle cx="120" cy="70" r="40" fill="#8b7dff" opacity=".75"/><text x="120" y="145" text-anchor="middle" fill="white" font-size="14">Demo Reference</text></svg>')])}><ImagePlus size={18} /><span>示例图</span></button>
        </div>
        <div className="reference-url"><Link2 size={14} /><input aria-label="参考图 URL" placeholder="粘贴公网图片 URL" onKeyDown={event => { if (event.key === 'Enter' && event.currentTarget.value.trim()) { setReferences([event.currentTarget.value.trim()]); event.currentTarget.value = '' } }} /><button type="button" aria-label="添加参考图 URL" onClick={event => { const input = event.currentTarget.previousElementSibling as HTMLInputElement; if (input.value.trim()) { setReferences([input.value.trim()]); input.value = '' } }}><Plus size={15} /></button></div>
      </section>

      <section className="config-section compact-section">
        <div className="section-title"><span className="section-icon orange"><Sparkles size={14} /></span><span>生成参数</span><span className="section-hint">不支持的取值将自动适配</span></div>
        <div className="control-row"><span className="control-label">比例</span><div className="chip-list">{ratios.map(ratio => <button type="button" className={`choice-chip ${draft.ratio === ratio ? 'active' : ''}`} key={ratio} onClick={() => update({ ratio })}>{ratio}</button>)}</div></div>
        <div className="control-row"><span className="control-label">清晰度</span><div className="chip-list">{(mode === 'image' ? imageResolutions : videoResolutions).map(resolution => <button type="button" className={`choice-chip ${draft.resolution === resolution ? 'active' : ''}`} key={resolution} onClick={() => update({ resolution })}>{resolution}</button>)}</div></div>
        {mode === 'video' && <><div className="control-row"><span className="control-label">时长</span><div className="chip-list">{durations.map(duration => <button type="button" className={`choice-chip ${draft.duration === duration ? 'active' : ''}`} key={duration} onClick={() => update({ duration })}>{duration}s</button>)}</div></div><div className="toggle-row"><span><span className="control-label">音频</span><small>为视频生成配音（可能加价）</small></span><button type="button" aria-label="音频开关" className={`toggle ${draft.audio ? 'active' : ''}`} onClick={() => update({ audio: !draft.audio })}><span /></button></div></>}
        <div className="control-row"><span className="control-label">数量</span><select aria-label="生成数量" className="count-select" value={draft.count} onChange={event => update({ count: Number(event.target.value) })}>{[1, 2, 4, 8].map(count => <option key={count} value={count}>{count} 份</option>)}</select></div>
      </section>

      <section className="config-section model-section"><div className="section-title"><span className="section-icon green"><Sparkles size={14} /></span><span>模型</span><span className="count-badge">已选 {selectedModels.length}</span><span className="section-hint">可多选，同时对比生成</span></div><ModelPicker models={models} selectedIds={draft.selectedModelIds} referencesCount={draft.references.length} onChange={selectedModelIds => update({ selectedModelIds })} /></section>
    </div>
    <div className="generate-footer"><div className="estimate-row"><span>预计创建任务</span><strong>{prompts.length * selectedModels.length * draft.count || 0} 个</strong></div><button type="button" className="generate-button" disabled={!prompts.length || !selectedModels.length} onClick={() => onGenerate({ prompts, models: selectedModels, count: draft.count, mode, draft })}><Sparkles size={17} />开始生成<span className="shortcut">⌘ ↵</span></button><button type="button" className="footer-settings" onClick={onOpenSettings}>API 设置 · {selectedModels.length ? '模型已就绪' : '请先选择模型'}</button></div>
  </aside>
}
