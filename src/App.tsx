import { useEffect, useState } from 'react'
import { CircleCheck, ListChecks } from 'lucide-react'
import { ProjectOverview } from './components/ProjectOverview'
import { RequirementPage } from './components/RequirementPage'
import { requirementPages } from './components/requirementPages'
import { WorkflowGuide } from './components/WorkflowGuide'
import { TaskForm } from './components/TaskForm'
import { TaskList } from './components/TaskList'
import { readTasks, saveTasks } from './services/taskStorage'
import type { Task } from './types/task'
import { removeTask, toggleTask } from './utils/tasks'

const navigation = [
  { href: '#/', label: 'Mis tareas' },
  { href: '#/guia-cicd', label: 'Guía de CI/CD' },
  { href: '#/ficha-tecnica', label: 'Ficha técnica' },
  ...requirementPages.map(({ href, label }) => ({ href, label })),
]

function loadState() {
  try {
    return { tasks: readTasks(window.localStorage), readFailed: false }
  } catch {
    return { tasks: [], readFailed: true }
  }
}

export default function App() {
  const [route, setRoute] = useState(() => window.location.hash || '#/')
  const requirementPage = requirementPages.find(({ href }) => href === route)
  const [initial] = useState(loadState)
  const [tasks, setTasks] = useState<Task[]>(initial.tasks)
  const [saveFailed, setSaveFailed] = useState(false)
  const completed = tasks.filter((task) => task.completed).length

  useEffect(() => {
    function updateRoute() {
      setRoute(window.location.hash || '#/')
      window.scrollTo(0, 0)
    }

    window.addEventListener('hashchange', updateRoute)
    return () => window.removeEventListener('hashchange', updateRoute)
  }, [])

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
      <header className="border-b border-ink-200 bg-ink-50/80">
        <div className="mx-auto flex min-h-17 max-w-5xl flex-wrap items-center gap-3 px-5 py-3 sm:px-8">
          <span className="grid size-10 place-items-center rounded-2xl bg-sage-100 text-sage-800">
            <ListChecks size={21} aria-hidden="true" />
          </span>
          <span className="text-xl font-bold tracking-tight text-ink-950">TaskFlow</span>
          <nav aria-label="Navegación principal" className="flex flex-wrap gap-1 sm:ml-auto">
            {navigation.map(({ href, label }) => (
              <a key={href} href={href} aria-current={route === href ? 'page' : undefined}
                className="rounded-full px-3 py-2 text-sm font-semibold text-ink-700 hover:bg-sage-50 aria-[current=page]:bg-sage-100 aria-[current=page]:text-sage-900">
                {label}
              </a>
            ))}
          </nav>
        </div>
      </header>
      {requirementPage ? <RequirementPage page={requirementPage} /> :
        route === '#/guia-cicd' ? <WorkflowGuide /> : route === '#/ficha-tecnica' ? <ProjectOverview /> : (
        <main className="mx-auto w-full max-w-3xl px-5 py-10 sm:px-8 sm:py-15">
        <div className="rounded-3xl border border-sage-200 bg-sage-50 px-6 py-7 sm:px-8 sm:py-9">
          <h1 className="text-4xl font-bold tracking-tight text-ink-950 sm:text-5xl">Mis tareas</h1>
          <p className="mt-3 text-ink-600">Organiza lo que tienes por hacer y sigue tu progreso.</p>
        </div>
        <div className="mt-8 rounded-3xl border border-ink-200 bg-white p-5 shadow-sm sm:p-7">
          <TaskForm onAdd={(title) => update([{ id: crypto.randomUUID(), title, completed: false }, ...tasks])} />
          {(initial.readFailed || saveFailed) && (
            <p role="status" className="mt-4 rounded-lg bg-amber-50 p-3 text-sm text-amber-950">
              {initial.readFailed
                ? 'No se pudieron cargar tus tareas guardadas. Los cambios se mantendrán solo mientras esta página esté abierta.'
                : 'No se pudieron guardar los cambios en este navegador.'}
            </p>
          )}
          <section aria-labelledby="task-list-heading" className="mt-7 border-t border-ink-100 pt-6">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <h2 id="task-list-heading" className="text-lg font-semibold text-ink-900">Lista de tareas</h2>
              <span role="status" className="inline-flex items-center gap-1.5 rounded-full bg-sage-50 px-3 py-1 text-sm font-medium text-sage-800">
                <CircleCheck size={15} aria-hidden="true" /> {completed} de {tasks.length} completadas
              </span>
            </div>
            <TaskList tasks={tasks} onToggle={(id) => update(toggleTask(tasks, id))}
              onRemove={(id) => update(removeTask(tasks, id))} />
          </section>
        </div>
        </main>
      )}
    </>
  )
}
