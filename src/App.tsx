import { useState } from 'react'
import { CircleCheck, ListChecks } from 'lucide-react'
import { TaskForm } from './components/TaskForm'
import { TaskList } from './components/TaskList'
import { readTasks, saveTasks } from './services/taskStorage'
import type { Task } from './types/task'
import { removeTask, toggleTask } from './utils/tasks'

function loadState() {
  try {
    return { tasks: readTasks(window.localStorage), readFailed: false }
  } catch {
    return { tasks: [], readFailed: true }
  }
}

export default function App() {
  const [initial] = useState(loadState)
  const [tasks, setTasks] = useState<Task[]>(initial.tasks)
  const [saveFailed, setSaveFailed] = useState(false)
  const completed = tasks.filter((task) => task.completed).length

  function update(next: Task[]) {
    setTasks(next)
    if (initial.readFailed) return
    try {
      saveTasks(window.localStorage, next)
      setSaveFailed(false)
    } catch {
      setSaveFailed(true)
    }
  }

  return (
    <>
      <header className="border-b border-indigo-100 bg-white">
        <div className="mx-auto flex h-17 max-w-5xl items-center gap-3 px-5 sm:px-8">
          <span className="grid size-9 place-items-center rounded-xl bg-indigo-700 text-white">
            <ListChecks size={21} aria-hidden="true" />
          </span>
          <span className="text-xl font-bold tracking-tight text-slate-950">TaskFlow</span>
        </div>
      </header>
      <main className="mx-auto w-full max-w-3xl px-5 py-10 sm:px-8 sm:py-15">
        <h1 className="text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">Mis tareas</h1>
        <p className="mt-3 text-slate-600">Organiza lo que tienes por hacer y sigue tu progreso.</p>
        <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <TaskForm onAdd={(title) => update([{ id: crypto.randomUUID(), title, completed: false }, ...tasks])} />
          {(initial.readFailed || saveFailed) && (
            <p role="status" className="mt-4 rounded-lg bg-amber-50 p-3 text-sm text-amber-950">
              {initial.readFailed
                ? 'No se pudieron cargar tus tareas guardadas. Los cambios se mantendrán solo mientras esta página esté abierta.'
                : 'No se pudieron guardar los cambios en este navegador.'}
            </p>
          )}
          <section aria-labelledby="task-list-heading" className="mt-7 border-t border-slate-100 pt-6">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <h2 id="task-list-heading" className="text-lg font-semibold text-slate-900">Lista de tareas</h2>
              <span role="status" className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-800">
                <CircleCheck size={15} aria-hidden="true" /> {completed} de {tasks.length} completadas
              </span>
            </div>
            <TaskList tasks={tasks} onToggle={(id) => update(toggleTask(tasks, id))}
              onRemove={(id) => update(removeTask(tasks, id))} />
          </section>
        </div>
      </main>
    </>
  )
}
