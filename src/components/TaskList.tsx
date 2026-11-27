import { Check, ClipboardList, Trash2 } from 'lucide-react'
import type { Task } from '../types/task'

interface Props {
  tasks: Task[]
  onToggle: (id: string) => void
  onRemove: (id: string) => void
}

export function TaskList({ tasks, onToggle, onRemove }: Props) {
  if (tasks.length === 0) {
    return (
      <div className="grid justify-items-center rounded-2xl border border-dashed border-sage-200 bg-sage-50/45 px-4 py-13 text-center">
        <div className="mb-4 rounded-2xl bg-sage-100 p-3 text-sage-700">
          <ClipboardList size={27} strokeWidth={1.7} aria-hidden="true" />
        </div>
        <p className="font-semibold text-ink-900">Todavía no hay tareas</p>
        <p className="mt-1 text-sm text-ink-600">Agrega tu primera tarea para empezar.</p>
      </div>
    )
  }

  return (
    <ul className="grid gap-2">
      {tasks.map((task) => (
        <li key={task.id} className="flex items-center gap-2 rounded-2xl border border-ink-200 bg-ink-50/60 px-2 sm:px-3">
          <label className="flex min-h-14 min-w-0 flex-1 cursor-pointer items-center gap-3 py-2 pl-2">
            <input type="checkbox" checked={task.completed} onChange={() => onToggle(task.id)} className="peer sr-only" />
            <span aria-hidden="true" className="grid size-5 shrink-0 place-items-center rounded-full border border-ink-400 peer-checked:border-sage-700 peer-checked:bg-sage-700 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-3 peer-focus-visible:outline-sage-600">
              {task.completed && <Check size={14} className="text-white" />}
            </span>
            <span className="min-w-0 wrap-anywhere text-ink-800 peer-checked:text-ink-500 peer-checked:line-through">
              {task.title}
            </span>
          </label>
          <button type="button" aria-label={`Eliminar tarea: ${task.title}`} onClick={() => onRemove(task.id)}
            className="grid size-11 shrink-0 place-items-center rounded-lg text-ink-500 hover:bg-rose-50 hover:text-rose-700">
            <Trash2 size={18} aria-hidden="true" />
          </button>
        </li>
      ))}
    </ul>
  )
}
