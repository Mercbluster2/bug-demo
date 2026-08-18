import { useState } from 'react'
import { TaskList } from './components/TaskList'
import { BugReporter } from './components/BugReporter'

export default function App() {
  const [tab, setTab] = useState<'app' | 'report'>('app')

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', maxWidth: 640, margin: '0 auto', padding: 24 }}>
      <h1 style={{ fontSize: 24, fontWeight: 700 }}>Bug Demo App</h1>
      <p style={{ color: '#666', marginTop: 4 }}>
        This app has an intentional bug. Find it, then use the Report tab to email it to OmniClaw.
      </p>

      <nav style={{ display: 'flex', gap: 8, marginTop: 16 }}>
        {(['app', 'report'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              padding: '8px 16px',
              borderRadius: 8,
              border: 'none',
              background: tab === t ? '#0d9488' : '#e2e8f0',
              color: tab === t ? '#fff' : '#334155',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            {t === 'app' ? 'Task App' : 'Report Bug'}
          </button>
        ))}
      </nav>

      <div style={{ marginTop: 20 }}>
        {tab === 'app' ? <TaskList /> : <BugReporter />}
      </div>
    </div>
  )
}
