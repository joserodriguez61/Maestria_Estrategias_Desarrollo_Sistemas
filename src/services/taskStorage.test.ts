import { describe, expect, it } from 'vitest'
import { readTasks, saveTasks } from './taskStorage'

describe('Almacenamiento de tareas', () => {
  it('devuelve una lista vacía si todavía no hay datos', () => {
    expect(readTasks({ getItem: () => null })).toEqual([])
  })

  it('conserva títulos y estado al guardar y volver a leer', () => {
    const entries = new Map<string, string>()
    const storage = {
      getItem: (key: string) => entries.get(key) ?? null,
      setItem: (key: string, value: string) => { entries.set(key, value) },
    }
    const tasks = [{ id: '1', title: 'Revisar documentación', completed: true }]
    saveTasks(storage, tasks)
    expect(readTasks(storage)).toEqual(tasks)
    saveTasks(storage, [])
    expect(readTasks(storage)).toEqual([])
  })

  it.each([
    '{',
    '{}',
    '[{"id":"1","title":"Una tarea","completed":"sí"}]',
    '[{"id":"1","title":"Primera","completed":false},{"id":"1","title":"Segunda","completed":true}]',
  ])('rechaza datos inválidos: %s', (raw) => {
    expect(() => readTasks({ getItem: () => raw })).toThrow()
  })

  it('propaga fallos de escritura para que la interfaz pueda informar al usuario', () => {
    const error = new Error('Almacenamiento lleno')
    expect(() => saveTasks({ setItem: () => { throw error } }, [])).toThrow(error)
  })
})
