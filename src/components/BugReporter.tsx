import { useState } from 'react'

const OMNICLAW_URL = 'http://localhost:10300/api/deliver'

export function BugReporter() {
  const [title, setTitle] = useState('Complete all button crashes with ReferenceError')
  const [description, setDescription] = useState(
    `Steps to reproduce:
1. Open the Task App tab
2. Click "Complete all"
3. A ReferenceError appears: "taks is not defined"

Expected: all tasks should be marked done.
Actual: app crashes with a typo — \`taks\` instead of \`tasks\` in completeAll().

File: src/components/TaskList.tsx, line ~37`
  )
  const [severity, setSeverity] = useState<'low' | 'medium' | 'high' | 'critical'>('high')
  const [sending, setSending] = useState(false)
  const [result, setResult] = useState<string | null>(null)

  const send = async () => {
    setSending(true)
    setResult(null)
    try {
      const res = await fetch(OMNICLAW_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          channel: 'gmail',
          recipient: 'navneet@cleartrust.cc',
          from_alternate: true,
          title: `[BUG][${severity.toUpperCase()}] ${title}`,
          text: `Bug Report\n\nTitle: ${title}\nSeverity: ${severity}\nRepo: f:/bug-demo\n\n${description}`,
        }),
      })
      const data = await res.json()
      if (!res.ok || data.ok === false) throw new Error(data.error || 'Send failed')
      setResult('Bug report emailed to navneet@cleartrust.cc via OmniClaw.')
    } catch (err) {
      setResult(`Error: ${err instanceof Error ? err.message : String(err)}`)
    } finally {
      setSending(false)
    }
  }

  return (
    <div>
      <div style={{ marginBottom: 12 }}>
        <label style={{ fontWeight: 600, fontSize: 14 }}>Title</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ display: 'block', width: '100%', padding: 8, borderRadius: 8, border: '1px solid #cbd5e1', marginTop: 4, boxSizing: 'border-box' }}
        />
      </div>

      <div style={{ marginBottom: 12 }}>
        <label style={{ fontWeight: 600, fontSize: 14 }}>Severity</label>
        <select
          value={severity}
          onChange={(e) => setSeverity(e.target.value as typeof severity)}
          style={{ display: 'block', padding: 8, borderRadius: 8, border: '1px solid #cbd5e1', marginTop: 4 }}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="critical">Critical</option>
        </select>
      </div>

      <div style={{ marginBottom: 12 }}>
        <label style={{ fontWeight: 600, fontSize: 14 }}>Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={10}
          style={{ display: 'block', width: '100%', padding: 8, borderRadius: 8, border: '1px solid #cbd5e1', marginTop: 4, fontFamily: 'monospace', fontSize: 13, boxSizing: 'border-box' }}
        />
      </div>

      <button
        onClick={send}
        disabled={sending || !title.trim()}
        style={{
          padding: '10px 20px',
          borderRadius: 8,
          border: 'none',
          background: '#dc2626',
          color: '#fff',
          fontWeight: 700,
          cursor: 'pointer',
          opacity: sending ? 0.6 : 1,
        }}
      >
        {sending ? 'Sending…' : 'Send Bug Report'}
      </button>

      {result && (
        <p style={{ marginTop: 12, padding: 12, borderRadius: 8, background: result.startsWith('Error') ? '#fef2f2' : '#f0fdf4', color: result.startsWith('Error') ? '#b91c1c' : '#166534', fontSize: 14 }}>
          {result}
        </p>
      )}
    </div>
  )
}
