import { useEffect, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useCourse } from './CourseProvider'
import { coursePath } from './links'
import { PrintModeContext } from './printMode'

/** Brand eye-mark (matches the picker logo). */
function EyeMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none" aria-hidden>
      <defs>
        <linearGradient id="pv-iris" x1="14" y1="14" x2="34" y2="34" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#863bff" />
          <stop offset="1" stopColor="#47bfff" />
        </linearGradient>
      </defs>
      <path d="M3 24 C 12 9, 36 9, 45 24 C 36 39, 12 39, 3 24 Z" fill="none" stroke="#7c3aed" strokeWidth="3.5" strokeLinejoin="round" />
      <circle cx="24" cy="24" r="9.6" fill="url(#pv-iris)" />
      <circle cx="24" cy="24" r="4.4" fill="#1e1b4b" />
      <circle cx="20.4" cy="20.4" r="1.9" fill="#fff" />
    </svg>
  )
}

/**
 * Print/PDF view: a clean cover + every (or one) lesson's full content stacked, all explainer tabs
 * expanded (PrintModeContext) and practice answers open. Direct "ייצא ל-PDF" via html2pdf (no print
 * dialog needed), plus a browser-print fallback.
 */
export default function PrintView() {
  const { courseId, course } = useCourse()
  const [sp] = useSearchParams()
  const only = sp.get('lecture')
  const lectures = only ? course.LECTURE_LIST.filter((l) => l.id === only) : course.LECTURE_LIST
  const scope = only ? lectures[0]?.titleHe ?? '' : 'ספר הקורס המלא'
  const contentRef = useRef<HTMLDivElement>(null)
  const [busy, setBusy] = useState(false)
  const dateHe = new Date().toLocaleDateString('he-IL', { day: 'numeric', month: 'long', year: 'numeric' })

  // open every native <details> so collapsed answers/sections land in the export
  const openDetails = () => contentRef.current?.querySelectorAll('details').forEach((d) => (d.open = true))
  useEffect(() => {
    openDetails()
  })

  async function exportPdf() {
    if (!contentRef.current) return
    setBusy(true)
    openDetails()
    await new Promise((r) => window.setTimeout(r, 400))
    await document.fonts.ready
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const html2pdf = (await import('html2pdf.js')).default as any
      await html2pdf()
        .set({
          margin: [10, 10, 12, 10],
          filename: `${only ?? `${courseId}-course`}.pdf`,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true, backgroundColor: '#ffffff', ignoreElements: (n: Element) => n.classList?.contains('no-print') },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
          // avoid-all: never split inside an element (cards/diagrams/rows) across pages
          pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
        })
        .from(contentRef.current)
        .save()
    } finally {
      setBusy(false)
    }
  }

  return (
    <PrintModeContext.Provider value={true}>
      <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6">
        {/* screen-only toolbar */}
        <div className="no-print mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <Link to={coursePath(courseId)} className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 px-4 py-1.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50">
            <span aria-hidden>←</span> חזרה
          </Link>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => window.print()} className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50">
              <span aria-hidden>🖨️</span> הדפסה
            </button>
            <button onClick={exportPdf} disabled={busy} className="inline-flex items-center gap-1.5 rounded-full border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-bold text-indigo-700 transition hover:bg-indigo-100 disabled:opacity-60">
              <span aria-hidden>⬇️</span> {busy ? 'מייצא…' : 'ייצא ל-PDF'}
            </button>
          </div>
        </div>

        <div ref={contentRef}>
          {/* cover */}
          <header className="mb-10 rounded-3xl border border-slate-200 bg-gradient-to-br from-violet-50 via-white to-sky-50 px-8 py-12 text-center">
            <EyeMark className="mx-auto mb-4 h-14 w-14" />
            <p className="text-sm font-semibold tracking-wide text-violet-500">הנדסה בעיניים</p>
            <h1 className="mt-1 text-4xl font-extrabold text-slate-900">{course.manifest.titleHe}</h1>
            <p className="mt-2 text-lg text-slate-500">{scope}</p>
            <p className="mt-4 text-sm text-slate-400">{dateHe}</p>
          </header>

          {lectures.map((lec, i) => {
            const Content = lec.summary
            return (
              <section key={lec.id} className={`mb-10 ${i > 0 ? 'break-before-page' : ''}`}>
                <h1 className="mb-4 border-b-4 border-violet-200 pb-2 text-2xl font-extrabold text-slate-900">
                  שיעור {lec.numberLabelHe ?? lec.number} · {lec.titleHe}
                </h1>
                <Content />
              </section>
            )
          })}
        </div>
      </div>
    </PrintModeContext.Provider>
  )
}
