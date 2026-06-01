import { useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

/**
 * A card used across the foundations tabs. With a `title` it is collapsible
 * (click the header to open/close) — matching the other lectures' sections.
 */
export default function Panel({
  title,
  children,
  defaultOpen = true,
}: {
  title?: string
  children: ReactNode
  defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)

  if (!title) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
        {children}
      </section>
    )
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 px-5 py-4 text-start transition hover:bg-slate-50"
      >
        <h3 className="text-lg font-bold text-slate-800">{title}</h3>
        <svg
          className={`h-5 w-5 shrink-0 text-slate-400 transition-transform duration-200 ${
            open ? 'rotate-180' : ''
          }`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
