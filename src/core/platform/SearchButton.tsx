 import { OPEN_COURSE_SEARCH } from './types'

/**
 * Header button that opens the course-wide quick-search modal (sibling of FormulasButton /
 * GlossaryButton). Fires the OPEN_COURSE_SEARCH window event; the modal (mounted by CourseProvider)
 * listens for it. Same chord also works via Ctrl+Shift+F.
 */
export default function SearchButton() {
  return (
    <button
      onClick={() => window.dispatchEvent(new Event(OPEN_COURSE_SEARCH))}
      title="חיפוש בקורס · Ctrl+Shift+F"
      className="inline-flex items-center gap-1.5 rounded-full border border-indigo-200 bg-indigo-50 px-3.5 py-2 text-sm font-semibold text-indigo-700 shadow-sm transition hover:border-indigo-300 hover:bg-indigo-100"
    >
      <span aria-hidden>🔎</span>
      חיפוש
    </button>
  )
}
