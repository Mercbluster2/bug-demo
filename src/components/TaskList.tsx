import { useState } from 'react'

interface Task {
  id: number
  text: string
  done: boolean
}

/**
 * INTENTIONAL BUG: The "Complete all" button calls `completeAll()` which
 * references `taks` instead of `tasks` — a ReferenceError at runtime.
 * The individual toggle works fine.
 */
export function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, text: 'Review PR #42', done: false },
    { id: 2, text: 'Write unit tests', done: false },
    { id: 3, text: 'Deploy to staging', done: false },
  ])
  const [input, setInput] = useState('')
  const [error, setError] = useState<string | null>(null)

  const addTask = () => {
    if (!input.trim()) return
    setTasks([...tasks, { id: Date.now(), text: input.trim(), done: false }])
    setInput('')
  }

  const toggle = (id: number) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)))
  }

  const completeAll = () => {
    try {
      // BUG: typo — `taks` instead of `tasks`
      // @ts-ignore deliberate typo to create a runtime ReferenceError
      const updated = taks.map((t: Task) => ({ ...t, done: true }))
      setTasks(updated)
    } catch (err) {
      setError(String(err))
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addTask()}
          placeholder="New task…"
          style={{ flex: 1, padding: 8, borderRadius: 8, border: '1px solid #cbd5e1' }}
        />
        <button
          onClick={addTask}
          style={{ padding: '8px 14px', borderRadius: 8, border: 'none', background: '#0d9488', color: '#fff', fontWeight: 600, cursor: 'pointer' }}
        >
          Add
        </button>
      </div>

      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {tasks.map((t) => (
          <li
            key={t.id}
            onClick={() => toggle(t.id)}
            style={{
              padding: '10px 12px',
              borderBottom: '1px solid #e2e8f0',
              cursor: 'pointer',
              textDecoration: t.done ? 'line-through' : 'none',
              color: t.done ? '#94a3b8' : '#1e293b',
            }}
          >
            {t.done ? '✓' : '○'} {t.text}
          </li>
        ))}
      </ul>

      <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
        <button
          onClick={completeAll}
          style={{ padding: '8px 14px', borderRadius: 8, border: '1px solid #cbd5e1', background: '#fff', cursor: 'pointer' }}
        >
          Complete all
        </button>
      </div>

      {error && (
        <pre style={{ marginTop: 12, padding: 12, borderRadius: 8, background: '#fef2f2', color: '#b91c1c', fontSize: 13, whiteSpace: 'pre-wrap' }}>
          {error}
        </pre>
      )}
    </div>
  )
}
