import type { Task } from '../types/task'

export const MAX_TITLE_LENGTH = 160

export function normalizeTitle(value: string): string | null {
  const title = value.trim()
  return title && title.length <= MAX_TITLE_LENGTH ? title : null
}

export function toggleTask(tasks: Task[], id: string): Task[] {
  return tasks.map((task) => task.id === id ? { ...task, completed: !task.completed } : task)
}

export function removeTask(tasks: Task[], id: string): Task[] {
  return tasks.filter((task) => task.id !== id)
}
