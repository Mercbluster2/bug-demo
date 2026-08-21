# bug-demo

Tiny task UI used to prove OmniClaw can watch a mailbox, see a bug email, and (later) open a PR.

## Run it

```bash
cd f:\bug-demo
copy .env.example .env.local
# fill GMAIL_USER, GMAIL_APP_PASSWORD, BUG_REPORT_TO
npm install
npm run dev
```

Open http://localhost:10400

`BUG_REPORT_TO` must be the mailbox your **Watch inbox** automation monitors.

## Demo script

1. Click **High priority only** — it crashes on purpose (`priority` is undefined in `src/app/page.tsx`).
2. The report form fills with the stack trace.
3. Click **Send to OmniClaw mailbox**.
4. In OmniClaw, run **Watch inbox** (or wait for the scheduler).
5. The mail should appear in **Work**. Use **View summary**. Approve when we wire the fixer.

The intentional bug is in `src/app/page.tsx` (`handleBrokenFilter`). A correct fix filters with `task.priority === 'high'`.
