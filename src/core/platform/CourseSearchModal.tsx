import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import Tex from '@/core/components/Tex'
import RichText from '@/core/components/RichText'
import { useCourse } from './CourseProvider'
import { lecturePath } from './links'
import { OPEN_COURSE_SEARCH } from './types'
import { buildIndex, search, type HitKind, type SearchHit } from './courseSearch'
import SaveButton from './SaveButton'

// clickable Greek palette (for users without a Greek keyboard) — the letters used across the course
const GREEK = ['φ', 'ψ', 'ρ', 'χ', 'ε', 'β', 'μ', 'λ', 'σ', 'Δ']

// tab order — משתנים first (the default on open)
const TABS: { kind: HitKind; he: string; active: string }[] = [
  { kind: 'symbol', he: 'משתנים', active: 'bg-emerald-600 text-white' },
  { kind: 'concept', he: 'מושגים', active: 'bg-violet-600 text-white' },
  { kind: 'formula', he: 'נוסחאות', active: 'bg-sky-600 text-white' },
]

/**
 * Course-wide quick search: a modal that scans every lecture's formulas, glossary concepts and
 * symbols, split into three tabs (משתנים / מושגים / נוסחאות; opens on משתנים). Mounted once per
 * course by CourseProvider — opened by Ctrl+Shift+F or the OPEN_COURSE_SEARCH event (header button).
 */
export default function CourseSearchModal() {
  const { courseId, course } = useCourse()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [tab, setTab] = useState<HitKind>('symbol')
  const inputRef = useRef<HTMLInputElement>(null)

  const index = useMemo(() => buildIndex(course.LECTURE_LIST), [course])
  const hits = useMemo(() => search(index, query), [index, query])
  const counts = useMemo(
    () => ({
      symbol: hits.filter((h) => h.kind === 'symbol').length,
      concept: hits.filter((h) => h.kind === 'concept').length,
      formula: hits.filter((h) => h.kind === 'formula').length,
    }),
    [hits],
  )
  const rows = hits.filter((h) => h.kind === tab)

  // Ctrl+Shift+F toggles (e.code → layout-independent, works on Hebrew keyboards)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && !e.altKey && e.code === 'KeyF') {
        e.preventDefault()
        setOpen((o) => !o)
      }
    }
    const onOpen = () => setOpen(true)
    window.addEventListener('keydown', onKey)
    window.addEventListener(OPEN_COURSE_SEARCH, onOpen)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener(OPEN_COURSE_SEARCH, onOpen)
    }
  }, [])

  // Esc closes (only while open)
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  // on open: focus the input and reset to the משתנים tab; reset query on close
  useEffect(() => {
    if (open) {
      setTab('symbol')
      setTimeout(() => inputRef.current?.focus(), 30)
    } else {
      setQuery('')
    }
  }, [open])

  const choose = (hit: SearchHit) => {
    setOpen(false)
    navigate(lecturePath(courseId, hit.lectureId))
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-start justify-center bg-slate-900/40 p-4 pt-[8vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setOpen(false)}
        >
          <motion.div
            className="flex max-h-[80vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl"
            initial={{ scale: 0.96, y: 12 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.96, y: 12 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* search bar */}
            <div className="flex shrink-0 items-center gap-3 border-b border-slate-100 bg-gradient-to-l from-sky-50 to-white px-5 py-3">
              <span aria-hidden className="text-lg">🔎</span>
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="חיפוש בקורס — נוסחה, מושג או משתנה (למשל V_T)…"
                dir="rtl"
                className="min-w-0 flex-1 bg-transparent text-base text-slate-800 placeholder:text-slate-400 focus:outline-none"
              />
              <button
                onClick={() => setOpen(false)}
                className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                aria-label="סגירה"
              >
                ✕
              </button>
            </div>

            {/* Greek palette — click to insert a letter without a Greek keyboard */}
            <div className="flex shrink-0 flex-wrap items-center gap-1.5 border-b border-slate-100 px-5 py-2" dir="rtl">
              <span className="me-1 text-xs font-semibold text-slate-400">סמלים:</span>
              {GREEK.map((g) => (
                <button
                  key={g}
                  onClick={() => {
                    setQuery((q) => q + g)
                    inputRef.current?.focus()
                  }}
                  className="grid h-7 w-7 place-items-center rounded-lg border border-slate-200 bg-white text-base text-slate-700 transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700"
                >
                  {g}
                </button>
              ))}
            </div>

            {/* category tabs */}
            <div className="flex shrink-0 gap-2 border-b border-slate-100 px-4 py-2" dir="rtl">
              {TABS.map((t) => {
                const isActive = tab === t.kind
                return (
                  <button
                    key={t.kind}
                    onClick={() => setTab(t.kind)}
                    className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-semibold transition ${isActive ? t.active : 'text-slate-600 hover:bg-slate-100'}`}
                  >
                    {t.he}
                    <span className={`rounded-full px-1.5 text-[11px] font-bold ${isActive ? 'bg-white/25 text-white' : 'bg-slate-100 text-slate-500'}`}>
                      {counts[t.kind]}
                    </span>
                  </button>
                )
              })}
            </div>

            {/* results — active tab only */}
            <div className="min-h-0 flex-1 overflow-auto px-4 py-3" dir="rtl">
              {!query.trim() ? (
                <p className="px-2 py-8 text-center text-sm text-slate-400">הקלידו כדי לחפש בנוסחאות, במושגים ובמשתנים של כל הקורס.</p>
              ) : rows.length === 0 ? (
                <p className="px-2 py-8 text-center text-sm text-slate-400">
                  אין תוצאות בקטגוריה זו עבור «{query}».
                  {hits.length > 0 && <span className="block">נסו לשונית אחרת.</span>}
                </p>
              ) : (
                <div className="flex flex-col gap-1">
                  {rows.map((h, i) => (
                    <div
                      key={`${h.lectureId}-${h.kind}-${i}`}
                      className="group flex items-start gap-2 rounded-xl border border-transparent px-3 py-2 transition hover:border-slate-200 hover:bg-slate-50"
                    >
                      <SaveButton
                        courseId={courseId}
                        lectureId={h.lectureId}
                        kind={h.kind}
                        refId={h.kind === 'symbol' ? (h.tex ?? h.label) : h.label}
                        label={h.label}
                        tex={h.tex}
                        note={h.note}
                        className="mt-0.5"
                      />
                      <button onClick={() => choose(h)} className="flex min-w-0 flex-1 items-start justify-between gap-3 text-start">
                      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                        <span className="flex flex-wrap items-baseline gap-x-2">
                          {h.kind === 'symbol' ? (
                            <>
                              <span className="font-mono text-base text-slate-900" dir="ltr"><Tex>{h.tex ?? ''}</Tex></span>
                              <span className="text-sm font-semibold text-slate-700"><RichText>{h.label}</RichText></span>
                            </>
                          ) : (
                            <span className="text-sm font-semibold text-slate-800"><RichText>{h.label}</RichText></span>
                          )}
                        </span>
                        {h.kind === 'formula' && h.tex && (
                          <span className="overflow-x-auto" dir="ltr"><Tex>{h.tex}</Tex></span>
                        )}
                        {h.note && <span className="text-xs leading-relaxed text-slate-500"><RichText>{h.note}</RichText></span>}
                      </span>
                      <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-500 transition group-hover:bg-sky-100 group-hover:text-sky-700">
                        {h.lectureTitle}
                      </span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="shrink-0 border-t border-slate-100 px-5 py-2 text-center text-[11px] text-slate-400">
              מחפש בנוסחאות, מושגים ומשתנים של כל הקורס · <kbd className="rounded bg-slate-100 px-1">Ctrl+Shift+F</kbd>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
