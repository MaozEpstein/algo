import type { ReactNode } from 'react'

/** A consistent white card used across the recurrence-lecture tabs. */
export default function Panel({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
      {title && <h3 className="mb-3 text-lg font-bold text-slate-800">{title}</h3>}
      {children}
    </section>
  )
}
