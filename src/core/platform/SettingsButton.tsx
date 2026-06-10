import { OPEN_SETTINGS } from './types'

/** Small ⚙️ button (picker + course-home headers) that opens the global Settings modal. */
export default function SettingsButton() {
  return (
    <button
      onClick={() => window.dispatchEvent(new Event(OPEN_SETTINGS))}
      title="הגדרות"
      aria-label="הגדרות"
      className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 py-1.5 text-sm font-semibold text-slate-600 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
    >
      <span aria-hidden>⚙️</span>
      הגדרות
    </button>
  )
}
