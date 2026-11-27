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
        className="min-h-12 min-w-0 flex-1 rounded-2xl border border-ink-200 bg-ink-50 px-4 text-ink-950 placeholder:text-ink-500 focus:border-sage-500"
      />
      <button type="submit" disabled={normalizeTitle(value) === null}
        className="flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-sage-700 px-5 font-semibold text-white hover:bg-sage-800 disabled:bg-sage-100 disabled:text-sage-800">
        <Plus size={18} aria-hidden="true" /> Agregar tarea
      </button>
    </form>
  )
}
