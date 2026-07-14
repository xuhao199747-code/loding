import { CheckCheck, Download, Filter, RefreshCw, Search, Trash2 } from 'lucide-react'
import { TaskCard } from './TaskCard'
import type { Task, TaskStatus } from '../types'

export type TaskFilter = 'all' | TaskStatus
interface Props { tasks: Task[]; filter: TaskFilter; onFilterChange: (filter: TaskFilter) => void; onRetry: (task: Task) => void; onRetryAll: () => void; onClear: () => void; onOpenTask: (task: Task) => void; onDelete: (task: Task) => void; onCopy: (task: Task) => void; onDownload: (task: Task) => void; onDownloadAll: () => void }

const filters: Array<[TaskFilter, string]> = [['all', '全部'], ['running', '进行中'], ['success', '成功'], ['error', '失败']]

export function TaskWorkspace({ tasks, filter, onFilterChange, onRetry, onRetryAll, onClear, onOpenTask, onDelete, onCopy, onDownload, onDownloadAll }: Props) {
  const visibleTasks = filter === 'all' ? tasks : tasks.filter(task => task.status === filter)
  const failedCount = tasks.filter(task => task.status === 'error').length
  const successCount = tasks.filter(task => task.status === 'success').length
  return <section className="queue-panel">
    <div className="queue-header"><div><div className="eyebrow">WORKSPACE / QUEUE</div><div className="queue-title-line"><h2>任务队列</h2><span className="queue-count">{tasks.length} 个任务</span></div></div><div className="queue-header-actions"><button type="button" className="toolbar-button" onClick={onRetryAll} disabled={!failedCount}><RefreshCw size={14} />重试失败{failedCount ? ` · ${failedCount}` : ''}</button><button type="button" className="toolbar-button" onClick={onDownloadAll} disabled={!successCount}><Download size={14} />下载成功</button><button type="button" className="toolbar-button danger-button" onClick={onClear} disabled={!tasks.length}><Trash2 size={14} />清空</button></div></div>
    <div className="queue-toolbar"><div className="filter-list">{filters.map(([key, label]) => <button type="button" key={key} className={`filter-chip ${filter === key ? 'active' : ''}`} onClick={() => onFilterChange(key)}>{label}<b>{key === 'all' ? tasks.length : tasks.filter(task => task.status === key).length}</b></button>)}</div><div className="queue-search"><Search size={14} /><span>搜索提示词或模型</span><Filter size={13} /></div></div>
    {visibleTasks.length ? <div className="task-grid">{visibleTasks.map(task => <TaskCard key={task.id} task={task} onRetry={onRetry} onOpen={onOpenTask} onDelete={onDelete} onCopy={onCopy} onDownload={onDownload} />)}</div> : <div className="queue-empty"><div className="empty-orbit"><CheckCheck size={26} /></div><h3>{tasks.length ? '当前筛选没有任务' : '准备开始你的第一批创作'}</h3><p>{tasks.length ? '试试切换其他状态筛选。' : '在左侧输入提示词，选择模型后即可一次生成多组结果。'}</p></div>}
  </section>
}
