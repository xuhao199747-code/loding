import { CheckCircle2, X } from 'lucide-react'

export interface Toast { id: string; message: string }
export function ToastStack({ toasts, onDismiss }: { toasts: Toast[]; onDismiss: (id: string) => void }) {
  return <div className="toast-stack">{toasts.map(toast => <div className="toast-item" key={toast.id}><CheckCircle2 size={15} /><span>{toast.message}</span><button type="button" onClick={() => onDismiss(toast.id)} aria-label="关闭提示"><X size={13} /></button></div>)}</div>
}
