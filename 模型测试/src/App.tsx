import { Activity, Image, Settings2, Sparkles, Video } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { getModels } from './data/models'
import { PromptPanel } from './components/PromptPanel'
import { SettingsDialog } from './components/SettingsDialog'
import { TaskDetailDialog } from './components/TaskDetailDialog'
import { TaskWorkspace, type TaskFilter } from './components/TaskWorkspace'
import { ToastStack, type Toast } from './components/ToastStack'
import { createApiClient, createOfflineTasks, runApiTask, runOfflineTask } from './lib/task-engine'
import { loadState, saveState } from './lib/storage'
import type { Draft, Mode, Settings, Task } from './types'

function App() {
  const initial = useMemo(() => loadState(), [])
  const [mode, setMode] = useState<Mode>(initial.mode)
  const [drafts, setDrafts] = useState(initial.drafts)
  const [tasks, setTasks] = useState<Task[]>(initial.tasks)
  const [settings, setSettings] = useState<Settings>(initial.settings)
  const [customModels, setCustomModels] = useState(initial.customModels)
  const [filter, setFilter] = useState<TaskFilter>('all')
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [detailTask, setDetailTask] = useState<Task | null>(null)
  const [toasts, setToasts] = useState<Toast[]>([])
  const cleanups = useRef(new Map<string, () => void>())
  const draft = drafts[mode]
  const models = useMemo(() => getModels(mode, customModels), [mode, customModels])

  useEffect(() => () => cleanups.current.forEach(cleanup => cleanup()), [])
  useEffect(() => { saveState({ settings, tasks, customModels, mode, drafts }) }, [settings, tasks, customModels, mode, drafts])

  const toast = (message: string) => { const id = `${Date.now()}-${Math.random()}`; setToasts(current => [...current, { id, message }]); window.setTimeout(() => setToasts(current => current.filter(item => item.id !== id)), 3200) }
  const updateDraft = (nextDraft: Draft) => setDrafts(current => ({ ...current, [mode]: nextDraft }))
  const updateTask = (nextTask: Task) => setTasks(current => current.map(task => task.id === nextTask.id ? nextTask : task))
  const startTask = (task: Task) => {
    cleanups.current.get(task.id)?.()
    const cleanup = settings.runMode === 'api'
      ? runApiTask(task, createApiClient(settings), updateTask)
      : runOfflineTask(task, updateTask)
    cleanups.current.set(task.id, cleanup)
  }

  useEffect(() => {
    initial.tasks.filter(task => task.status === 'running' || task.status === 'queued').forEach(startTask)
  }, [])

  const handleGenerate = async (input: { prompts: string[]; models: typeof models; count: number; mode: Mode; draft: Draft }) => {
    if (settings.runMode === 'offline') {
      const created = createOfflineTasks(input)
      setTasks(current => [...created, ...current])
      created.forEach(startTask)
      toast(`已创建 ${created.length} 个离线任务`)
      return
    }
    try {
      const created = await createApiClient(settings).createTask(input)
      setTasks(current => [...created, ...current])
      created.forEach(startTask)
      toast(`已提交 ${created.length} 个 API 任务`)
    } catch (error) {
      toast(error instanceof Error ? error.message : 'API 请求失败')
    }
  }

  const retryTask = async (task: Task) => {
    cleanups.current.get(task.id)?.()
    if (settings.runMode === 'api') {
      try {
        const [created] = await createApiClient(settings).createTask({ prompts: [task.prompt], models: [task.model], count: 1, mode: task.mode, draft: drafts[task.mode] })
        setTasks(current => current.map(item => item.id === task.id ? created : item))
        startTask(created)
        toast('API 任务已重新提交')
      } catch (error) {
        updateTask({ ...task, status: 'error', progress: 100, error: error instanceof Error ? error.message : '重试失败' })
        toast(error instanceof Error ? error.message : 'API 重试失败')
      }
      return
    }
    const reset = { ...task, status: 'queued' as const, progress: 0, error: undefined, outputUrl: undefined }
    updateTask(reset)
    startTask(reset)
    toast('已重新加入生成队列')
  }
  const retryAll = () => { tasks.filter(task => task.status === 'error').forEach(retryTask) }
  const deleteTask = (task: Task) => { cleanups.current.get(task.id)?.(); setTasks(current => current.filter(item => item.id !== task.id)); if (detailTask?.id === task.id) setDetailTask(null) }
  const copyPrompt = async (task: Task) => {
    try {
      if (navigator.clipboard) await navigator.clipboard.writeText(task.prompt)
      toast('提示词已复制')
    } catch {
      toast('当前环境不支持自动复制，请手动复制')
    }
  }
  const downloadTask = (task: Task) => { if (!task.outputUrl) return; const link = document.createElement('a'); link.href = task.outputUrl; link.download = `canvas-ai-${task.id}.${task.mode === 'image' ? 'svg' : 'mp4'}`; link.click(); toast('结果下载已开始') }
  const downloadAll = () => tasks.filter(task => task.status === 'success').forEach(downloadTask)
  const useAsReference = () => { if (!detailTask?.outputUrl) return; updateDraft({ ...draft, references: [...draft.references, detailTask.outputUrl] }); setDetailTask(null); toast('已加入参考素材') }
  const clearTasks = () => { if (!window.confirm('确定清空所有任务吗？')) return; cleanups.current.forEach(cleanup => cleanup()); cleanups.current.clear(); setTasks([]); toast('任务队列已清空') }
  const saveSettings = (nextSettings: Settings, nextModels: typeof customModels) => { setSettings(nextSettings); setCustomModels(nextModels); toast('设置已保存') }

  return <div className="app-shell">
    <header className="topbar">
      <div className="brand-lockup"><div className="brand-mark"><Sparkles size={18} /></div><div><div className="brand-name">Canvas AI</div><div className="brand-subtitle">批量生成工作台</div></div></div>
      <div className="mode-tabs" role="tablist" aria-label="生成模式"><button className={`mode-tab ${mode === 'image' ? 'active' : ''}`} role="tab" aria-selected={mode === 'image'} onClick={() => setMode('image')}><Image size={15} />生图</button><button className={`mode-tab ${mode === 'video' ? 'active' : ''}`} role="tab" aria-selected={mode === 'video'} onClick={() => setMode('video')}><Video size={15} />生视频</button></div>
      <div className="topbar-spacer" /><div className="run-status"><span className="status-dot" />{settings.runMode === 'offline' ? '离线演示' : 'API 已连接'}</div><div className="balance-pill"><Activity size={14} />{settings.runMode === 'offline' ? '本地模式' : '余额待刷新'}</div><button className="icon-button" aria-label="打开 API 设置" onClick={() => setSettingsOpen(true)}><Settings2 size={17} /></button>
    </header>
    <main className="workspace"><PromptPanel mode={mode} draft={draft} models={models} onDraftChange={updateDraft} onGenerate={handleGenerate} onOpenSettings={() => setSettingsOpen(true)} /><TaskWorkspace tasks={tasks} filter={filter} onFilterChange={setFilter} onRetry={retryTask} onRetryAll={retryAll} onClear={clearTasks} onOpenTask={setDetailTask} onDelete={deleteTask} onCopy={copyPrompt} onDownload={downloadTask} onDownloadAll={downloadAll} /></main>
    <SettingsDialog open={settingsOpen} settings={settings} customModels={customModels} onClose={() => setSettingsOpen(false)} onSave={saveSettings} />
    <TaskDetailDialog task={detailTask} onClose={() => setDetailTask(null)} onCopy={() => detailTask && copyPrompt(detailTask)} onDownload={() => detailTask && downloadTask(detailTask)} onUseAsReference={useAsReference} />
    <ToastStack toasts={toasts} onDismiss={id => setToasts(current => current.filter(item => item.id !== id))} />
  </div>
}

export default App
