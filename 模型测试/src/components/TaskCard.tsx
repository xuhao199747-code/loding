import { CheckCircle2, Copy, Download, ExternalLink, Image as ImageIcon, LoaderCircle, MoreHorizontal, Play, RefreshCw, RotateCcw, Trash2 } from 'lucide-react'
import type { Task } from '../types'
import { formatElapsed } from '../lib/format'

interface Props { task: Task; onRetry: (task: Task) => void; onOpen: (task: Task) => void; onDelete: (task: Task) => void; onCopy: (task: Task) => void; onDownload: (task: Task) => void }

export function TaskCard({ task, onRetry, onOpen, onDelete, onCopy, onDownload }: Props) {
  const statusLabel = { queued: '排队中', running: '生成中', success: '已完成', error: '失败' }[task.status]
  return <article className={`task-card status-${task.status}`}>
    <button className="task-preview" type="button" onClick={() => onOpen(task)} aria-label={`打开 ${task.model.name} 结果`}>
      {task.outputUrl ? <>{task.outputKind === 'video' ? <div className="video-poster"><Play size={22} /><span>VIDEO</span></div> : <img src={task.outputUrl} alt={task.prompt} />}</> : <div className="task-placeholder">{task.status === 'error' ? <span className="error-mark">!</span> : <LoaderCircle className="task-spinner" size={24} />}<span>{task.status === 'error' ? '生成失败' : `${task.progress}%`}</span>{task.status !== 'error' && <i style={{ width: `${task.progress}%` }} />}</div>}
      <span className={`status-chip ${task.status}`}>{task.status === 'success' && <CheckCircle2 size={12} />}{statusLabel}</span>
      <span className="preview-more"><MoreHorizontal size={16} /></span>
    </button>
    <div className="task-body">
      <div className="task-meta-row"><span className="model-dot" style={{ background: task.model.color }} /><strong>{task.model.name}</strong><span className="task-time">{formatElapsed(task.elapsedMs)}</span></div>
      <button type="button" className="task-prompt" onClick={() => onOpen(task)}>{task.prompt}</button>
      <div className="task-submeta"><span>{task.used}</span>{task.status === 'success' && <span className="task-cost">模拟 ¥0.00</span>}</div>
      {task.error && <div className="task-error">{task.error}</div>}
      <div className="task-actions"><button type="button" aria-label="复制提示词" onClick={() => onCopy(task)}><Copy size={14} /></button>{task.status === 'success' && <button type="button" aria-label="下载结果" onClick={() => onDownload(task)}><Download size={14} /></button>}{task.status === 'error' && <button type="button" aria-label="重试任务" onClick={() => onRetry(task)}><RefreshCw size={14} /></button>}<button type="button" className="danger-icon" aria-label="删除任务" onClick={() => onDelete(task)}><Trash2 size={14} /></button></div>
    </div>
  </article>
}
