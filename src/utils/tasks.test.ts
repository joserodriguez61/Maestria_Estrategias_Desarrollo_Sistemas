import { describe, expect, it } from 'vitest'
import { MAX_TITLE_LENGTH, normalizeTitle, removeTask, toggleTask } from './tasks'

const task = { id: '1', title: 'Preparar informe', completed: false }
const other = { id: '2', title: 'Enviar informe', completed: true }

describe('Títulos de tareas', () => {
  it('elimina espacios al principio y al final', () => {
    expect(normalizeTitle('  Preparar informe  ')).toBe(task.title)
  })

  it('rechaza entradas vacías o que superan el límite', () => {
    expect(normalizeTitle('   ')).toBeNull()
    expect(normalizeTitle('a'.repeat(MAX_TITLE_LENGTH + 1))).toBeNull()
    expect(normalizeTitle('a'.repeat(MAX_TITLE_LENGTH))).toHaveLength(MAX_TITLE_LENGTH)
  })
})

describe('Operaciones sobre tareas', () => {
  it('alterna el estado de la tarea seleccionada sin mutar la original', () => {
    const original = [task, other]
    const updated = toggleTask(original, task.id)
    expect(updated).toEqual([{ ...task, completed: true }, other])
    expect(toggleTask(updated, task.id)).toEqual(original)
    expect(task.completed).toBe(false)
  })

  it('elimina únicamente la tarea seleccionada', () => {
    expect(removeTask([task, other], task.id)).toEqual([other])
    expect(removeTask([task, other], 'inexistente')).toEqual([task, other])
  })
})
