import { AnimatePresence, motion } from 'framer-motion'

interface Props {
  title: string
  open: boolean
  onToggle: () => void
  children: React.ReactNode
}

/**
 * A collapsible summary section (controlled by the parent so "expand all"
 * before PDF export works). The body unmounts when closed; forcing `open`
 * before printing guarantees the section appears in the exported PDF.
 */
export default function CollapsibleSection({ title, open, onToggle, children }: Props) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card [break-inside:avoid]">
      <button
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 px-5 py-4 text-start transition hover:bg-slate-50"
      >
        <h2 className="text-lg font-bold text-slate-800">{title}</h2>
        <svg
          className={`no-print h-5 w-5 shrink-0 text-slate-400 transition-transform duration-200 ${
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
