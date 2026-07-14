import { Copy, Download, ExternalLink, ImagePlus, X } from 'lucide-react'
import type { Task } from '../types'
import { formatElapsed, formatTime } from '../lib/format'

interface Props { task: Task | null; onClose: () => void; onCopy: () => void; onDownload: () => void; onUseAsReference: () => void }

export function TaskDetailDialog({ task, onClose, onCopy, onDownload, onUseAsReference }: Props) {
  if (!task) return null
  return <div className="modal-layer" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget) onClose() }}><div className="detail-modal" role="dialog" aria-modal="true" aria-label="任务详情"><div className="modal-heading"><div><div className="eyebrow">TASK DETAIL</div><h3>{task.model.name}</h3></div><button type="button" className="modal-close" onClick={onClose} aria-label="关闭详情"><X size={17} /></button></div><div className="detail-media">{task.outputUrl ? <img src={task.outputUrl} alt={task.prompt} /> : <div className="detail-loading">{task.error ?? '任务正在生成中…'}</div>}</div><div className="detail-prompt">{task.prompt}</div><div className="detail-info"><span><b>模型</b>{task.model.name}</span><span><b>参数</b>{task.used}</span><span><b>创建时间</b>{formatTime(task.createdAt)}</span><span><b>耗时</b>{formatElapsed(task.elapsedMs)}</span></div><div className="modal-actions"><button type="button" className="toolbar-button" onClick={onCopy}><Copy size={14} />复制提示词</button><button type="button" className="toolbar-button" onClick={onUseAsReference}><ImagePlus size={14} />作为参考图</button><button type="button" className="toolbar-button" onClick={onDownload} disabled={task.status !== 'success'}><Download size={14} />下载</button>{task.outputUrl && <a className="toolbar-button" href={task.outputUrl} target="_blank" rel="noreferrer"><ExternalLink size={14} />打开链接</a>}</div></div></div>
}
