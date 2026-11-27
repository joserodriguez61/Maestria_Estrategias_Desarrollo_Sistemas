import type { Task } from '../types/task'
import { normalizeTitle } from '../utils/tasks'

const STORAGE_KEY = 'taskflow.tasks'

function isTask(value: unknown): value is Task {
  if (typeof value !== 'object' || value === null) return false
  const task = value as Record<string, unknown>
  return typeof task.id === 'string' && task.id.length > 0 &&
    typeof task.title === 'string' && normalizeTitle(task.title) !== null &&
    typeof task.completed === 'boolean'
}

export function readTasks(storage: Pick<Storage, 'getItem'>): Task[] {
  const raw = storage.getItem(STORAGE_KEY)
  if (raw === null) return []

  const data: unknown = JSON.parse(raw)
  if (!Array.isArray(data) || !data.every(isTask) ||
      new Set(data.map((task) => task.id)).size !== data.length) {
    throw new Error('Los datos guardados no tienen un formato válido.')
  }

  return data
}

export function saveTasks(storage: Pick<Storage, 'setItem'>, tasks: Task[]): void {
  storage.setItem(STORAGE_KEY, JSON.stringify(tasks))
}
