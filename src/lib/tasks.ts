export type Task = {
  id: string
  title: string
  owner: string
  due: string
  priority: 'high' | 'normal'
}

export const TASKS: Task[] = [
  { id: '1', title: 'Review CC-581 agentic API toggle', owner: 'Navneet', due: '2026-08-18', priority: 'high' },
  { id: '2', title: 'Ship morning digest to Slack', owner: 'OmniClaw', due: '2026-08-19', priority: 'normal' },
  { id: '3', title: 'Rotate Gmail app password', owner: 'Navneet', due: '2026-08-22', priority: 'high' },
]

export function countOpenTasks(tasks: Task[]) {
  return tasks.length
}

export function formatDueLabel(due: string) {
  const date = new Date(`${due}T00:00:00`)
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}
