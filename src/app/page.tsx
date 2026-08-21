'use client'

import { useState } from 'react'
import { countOpenTasks, formatDueLabel, TASKS } from '@/lib/tasks'

export default function HomePage() {
  const [reportOpen, setReportOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [steps, setSteps] = useState('')
  const [expected, setExpected] = useState('')
  const [actual, setActual] = useState('')
  const [sending, setSending] = useState(false)
  const [status, setStatus] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [crash, setCrash] = useState<string | null>(null)

  const openCount = countOpenTasks(TASKS)

  const handleBrokenFilter = () => {
    try {
      // Intentional bug: `priority` is never defined. Clicking "High priority"
      // throws and is what you email to OmniClaw.
      // @ts-expect-error demo bug — undefined identifier
      const filtered = TASKS.filter((task) => task.priority === priority)
      console.log(filtered)
    } catch (err) {
      const message = err instanceof Error ? err.stack || err.message : String(err)
      setCrash(message)
      setReportOpen(true)
      setTitle('High-priority filter crashes the task list')
      setSteps('1. Open the Tasks page\n2. Click "High priority only"')
      setExpected('Show only high-priority tasks')
      setActual(message.split('\n')[0] || 'The page crashed')
    }
  }

  const handleSend = async () => {
    setSending(true)
    setStatus(null)
    setError(null)
    try {
      const res = await fetch('/api/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          steps,
          expected,
          actual,
          stack: crash,
          page: '/',
        }),
      })
      const data = await res.json()
      if (!res.ok || data.ok === false) {
        throw new Error(data.error || 'Could not send the bug report')
      }
      setStatus(`Sent to ${data.to}. OmniClaw should pick this up on the next Watch inbox run.`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Send failed')
    } finally {
      setSending(false)
    }
  }

  return (
    <main style={{ maxWidth: 720, margin: '0 auto', padding: '40px 20px' }}>
      <p style={{ fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#5eead4' }}>
        Internal · ClearTrust
      </p>
      <h1 style={{ fontSize: 28, margin: '8px 0 6px' }}>Team tasks</h1>
      <p style={{ color: '#94a3b8', marginBottom: 24 }}>
        {openCount} open · click a filter, then file a bug if something breaks.
      </p>

      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        <button
          type="button"
          onClick={handleBrokenFilter}
          style={buttonStyle('#f43f5e')}
        >
          High priority only
        </button>
        <button type="button" onClick={() => setReportOpen(true)} style={buttonStyle('#334155')}>
          Report a bug
        </button>
      </div>

      <ul style={{ listStyle: 'none', display: 'grid', gap: 10 }}>
        {TASKS.map((task) => (
          <li
            key={task.id}
            style={{
              background: '#1e293b',
              border: '1px solid #334155',
              borderRadius: 12,
              padding: '14px 16px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
              <strong>{task.title}</strong>
              <span style={{ fontSize: 12, color: '#94a3b8' }}>{formatDueLabel(task.due)}</span>
            </div>
            <p style={{ fontSize: 13, color: '#94a3b8', marginTop: 4 }}>{task.owner}</p>
          </li>
        ))}
      </ul>

      {reportOpen && (
        <section
          style={{
            marginTop: 28,
            background: '#1e293b',
            border: '1px solid #334155',
            borderRadius: 16,
            padding: 20,
          }}
        >
          <h2 style={{ fontSize: 18, marginBottom: 12 }}>Report a bug</h2>
          <label style={labelStyle}>Title</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} style={inputStyle} />
          <label style={labelStyle}>Steps to reproduce</label>
          <textarea rows={3} value={steps} onChange={(e) => setSteps(e.target.value)} style={inputStyle} />
          <label style={labelStyle}>Expected</label>
          <textarea rows={2} value={expected} onChange={(e) => setExpected(e.target.value)} style={inputStyle} />
          <label style={labelStyle}>Actual</label>
          <textarea rows={3} value={actual} onChange={(e) => setActual(e.target.value)} style={inputStyle} />
          {crash && (
            <pre
              style={{
                marginTop: 10,
                fontSize: 11,
                whiteSpace: 'pre-wrap',
                background: '#0f172a',
                padding: 10,
                borderRadius: 8,
                color: '#fda4af',
              }}
            >
              {crash}
            </pre>
          )}
          <button
            type="button"
            disabled={sending || !title.trim()}
            onClick={handleSend}
            style={{ ...buttonStyle('#14b8a6'), marginTop: 14, opacity: sending || !title.trim() ? 0.5 : 1 }}
          >
            {sending ? 'Sending…' : 'Send to OmniClaw mailbox'}
          </button>
          {status && <p style={{ marginTop: 10, fontSize: 13, color: '#5eead4' }}>{status}</p>}
          {error && <p style={{ marginTop: 10, fontSize: 13, color: '#fda4af' }}>{error}</p>}
        </section>
      )}
    </main>
  )
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 12,
  color: '#94a3b8',
  marginTop: 10,
  marginBottom: 4,
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: '#0f172a',
  border: '1px solid #334155',
  borderRadius: 8,
  color: '#e2e8f0',
  padding: '8px 10px',
  fontFamily: 'inherit',
}

function buttonStyle(bg: string): React.CSSProperties {
  return {
    background: bg,
    color: 'white',
    border: 'none',
    borderRadius: 8,
    padding: '8px 12px',
    fontWeight: 600,
    cursor: 'pointer',
  }
}
