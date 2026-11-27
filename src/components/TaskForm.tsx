import { useState, type FormEvent } from 'react'
import { Plus } from 'lucide-react'
import { MAX_TITLE_LENGTH, normalizeTitle } from '../utils/tasks'

export function TaskForm({ onAdd }: { onAdd: (title: string) => void }) {
  const [value, setValue] = useState('')

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const title = normalizeTitle(value)
    if (title === null) return
    onAdd(title)
    setValue('')
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-3 sm:flex-row">
      <label htmlFor="task-title" className="sr-only">Nueva tarea</label>
      <input
        id="task-title"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        maxLength={MAX_TITLE_LENGTH}
        required
        placeholder="¿Qué necesitas hacer?"
        className="min-h-12 min-w-0 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 text-slate-950 placeholder:text-slate-500 focus:border-indigo-500"
      />
      <button type="submit" disabled={normalizeTitle(value) === null}
        className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-indigo-700 px-5 font-semibold text-white hover:bg-indigo-800 disabled:bg-indigo-600">
        <Plus size={18} aria-hidden="true" /> Agregar tarea
      </button>
    </form>
  )
}
