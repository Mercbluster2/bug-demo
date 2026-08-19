import { useState } from 'react'

interface Task {
  id: number
  text: string
  done: boolean
}

/**
 * Demo task list. "Complete all" works unless you click "Break it",
 * which restores the original `tasks` typo so OmniClaw can be tested again.
 */
export function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, text: 'Review PR #42', done: false },
    { id: 2, text: 'Write unit tests', done: false },
    { id: 3, text: 'Deploy to staging', done: false },
  ])
  const [input, setInput] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [broken, setBroken] = useState(false)

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
      setError(null)
      if (broken) {
        // Deliberate crash for OmniClaw: `taks` is not defined.
        const updated = (tasks as Task[]).map((t: Task) => ({ ...t, done: true }))
        setTasks(updated)
      } else {
        setTasks(tasks.map((t) => ({ ...t, done: true })))
      }
    } catch (err) {
      setError(String(err))
    }
  }

  const toggleBug = () => {
    setBroken((prev) => !prev)
    setError(null)
    setTasks((current) => current.map((t) => ({ ...t, done: false })))
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

      <div style={{ marginTop: 12, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <button
          onClick={completeAll}
          style={{ padding: '8px 14px', borderRadius: 8, border: '1px solid #cbd5e1', background: '#fff', cursor: 'pointer' }}
        >
          Complete all
        </button>
        <button
          onClick={toggleBug}
          style={{
            padding: '8px 14px',
            borderRadius: 8,
            border: 'none',
            background: broken ? '#b91c1c' : '#f59e0b',
            color: '#fff',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          {broken ? 'Bug is on — click to restore' : 'Break it (for testing)'}
        </button>
      </div>
      {broken && (
        <p style={{ marginTop: 8, fontSize: 13, color: '#b91c1c' }}>
          Complete all now calls `taks` and will throw ReferenceError.
        </p>
      )}

      {error && (
        <pre style={{ marginTop: 12, padding: 12, borderRadius: 8, background: '#fef2f2', color: '#b91c1c', fontSize: 13, whiteSpace: 'pre-wrap' }}>
          {error}
        </pre>
      )}
    </div>
  )
}
