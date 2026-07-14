import { Check, ChevronDown, CircleAlert, Cpu } from 'lucide-react'
import type { ModelDefinition } from '../types'

interface Props {
  models: ModelDefinition[]
  selectedIds: string[]
  referencesCount: number
  onChange: (ids: string[]) => void
}

export function ModelPicker({ models, selectedIds, referencesCount, onChange }: Props) {
  const groups = [...new Set(models.map(model => model.vendor))]
  return <div className="model-groups">
    {groups.map(vendor => {
      const vendorModels = models.filter(model => model.vendor === vendor)
      return <details key={vendor} className="model-group" open>
        <summary><span className="summary-chevron"><ChevronDown size={14} /></span><Cpu size={14} /><span>{vendor}</span><span className="model-count">{vendorModels.length} 个模型</span></summary>
        <div className="model-list">
          {vendorModels.map(model => {
            const disabled = referencesCount > model.maxReferences
            const selected = selectedIds.includes(model.id)
            return <button key={model.id} type="button" className={`model-card ${selected ? 'selected' : ''} ${disabled ? 'disabled' : ''}`} disabled={disabled} title={disabled ? `最多支持 ${model.maxReferences} 张参考图` : model.name} onClick={() => onChange(selected ? selectedIds.filter(id => id !== model.id) : [...selectedIds, model.id])}>
              <span className="model-card-top"><span className="model-swatch" style={{ background: model.color }} /><span className="model-name">{model.name}</span>{selected && <Check size={14} className="model-check" />}</span>
              <span className="model-badges">{model.badges.slice(0, 2).map(badge => <span key={badge}>{badge}</span>)}{disabled && <span className="model-disabled"><CircleAlert size={11} />超出参考图限制</span>}</span>
            </button>
          })}
        </div>
      </details>
    })}
  </div>
}
