import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export const runtime = 'nodejs'

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}))
  const title = String(body.title || '').trim()
  const steps = String(body.steps || '').trim()
  const expected = String(body.expected || '').trim()
  const actual = String(body.actual || '').trim()
  const stack = String(body.stack || '').trim()
  const page = String(body.page || '/')

  const user = process.env.GMAIL_USER || ''
  const pass = (process.env.GMAIL_APP_PASSWORD || '').replace(/\s/g, '')
  const to = process.env.BUG_REPORT_TO || user

  if (!title) {
    return NextResponse.json({ ok: false, error: 'Title is required' }, { status: 400 })
  }
  if (!user.includes('@') || pass.length < 8) {
    return NextResponse.json(
      {
        ok: false,
        error: 'Set GMAIL_USER and GMAIL_APP_PASSWORD in bug-demo/.env.local (copy from .env.example).',
      },
      { status: 400 }
    )
  }

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: { user, pass },
  })

  const text = [
    'BUG REPORT — please fix in the bug-demo repo and open a PR.',
    '',
    `App: ClearTrust Tasks (bug-demo)`,
    `Page: ${page}`,
    `Title: ${title}`,
    '',
    'Steps to reproduce:',
    steps || '(none provided)',
    '',
    `Expected: ${expected || '(none)'}`,
    `Actual: ${actual || '(none)'}`,
    '',
    stack ? `Stack:\n${stack}` : '',
    '',
    'Repo: f:/bug-demo',
    'File that crashes: src/app/page.tsx (High priority only button)',
    'Likely helper: src/lib/tasks.ts',
  ]
    .filter((line) => line !== undefined)
    .join('\n')

  await transporter.sendMail({
    from: user,
    to,
    subject: `[BUG] ${title}`,
    text,
  })

  return NextResponse.json({ ok: true, to })
}
