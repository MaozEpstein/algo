import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import RichText from '@/core/components/RichText'
import Tex from '@/core/components/Tex'
import { examViewPath } from './links'
import type { ExamCategory, ExamEntry, ExamStudyGuide } from './types'

/**
 * A centered modal (covers most of the screen, not all) that shows the exam-question
 * taxonomy: each recurring template (style) with the questions that match it. Chips
 * link to the exam's PDF. Opened from the "טבלה לפי קטגוריה" button on the exam bank.
 */

const ACCENTS = [
  'from-emerald-50 text-emerald-700 ring-emerald-200',
  'from-sky-50 text-sky-700 ring-sky-200',
  'from-violet-50 text-violet-700 ring-violet-200',
  'from-amber-50 text-amber-700 ring-amber-200',
  'from-rose-50 text-rose-700 ring-rose-200',
  'from-indigo-50 text-indigo-700 ring-indigo-200',
  'from-teal-50 text-teal-700 ring-teal-200',
]

type Tab = 'categories' | 'formulas' | 'insights' | 'recipes'

/** Per-step-kind label + colour for the recipe stepper. */
const KIND_META: Record<'model' | 'formula' | 'substitute' | 'theorem' | 'result', { he: string; chip: string; dot: string }> = {
  model: { he: 'אפיון', chip: 'bg-slate-100 text-slate-600', dot: 'bg-slate-400' },
  formula: { he: 'נוסחה', chip: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-500' },
  substitute: { he: 'הצבה', chip: 'bg-sky-100 text-sky-700', dot: 'bg-sky-500' },
  theorem: { he: 'משפט', chip: 'bg-violet-100 text-violet-700', dot: 'bg-violet-500' },
  result: { he: 'תוצאה', chip: 'bg-amber-100 text-amber-700', dot: 'bg-amber-500' },
}

export default function ExamCategoriesModal({
  open,
  onClose,
  courseId,
  categories,
  exams,
  studyGuide,
}: {
  open: boolean
  onClose: () => void
  courseId: string
  categories: ExamCategory[]
  exams: ExamEntry[]
  studyGuide?: ExamStudyGuide
}) {
  const [tab, setTab] = useState<Tab>('categories')
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const examById = (id: string) => exams.find((e) => e.id === id)
  const total = categories.reduce((s, c) => s + c.instances.length, 0)

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="flex h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl"
            initial={{ scale: 0.96, y: 12 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.96, y: 12 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="shrink-0 border-b border-slate-200 bg-gradient-to-l from-emerald-50 to-white px-6 py-3">
              <div className="flex items-center justify-between gap-4">
                <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900">
                  <span aria-hidden>📊</span>
                  מבחנים — ניתוח לפי סגנון
                </h3>
                <button
                  onClick={onClose}
                  className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                  aria-label="סגירה"
                >
                  ✕
                </button>
              </div>
              {studyGuide && (
                <div className="mt-3 grid grid-cols-2 gap-1.5 rounded-2xl bg-slate-100 p-1.5 sm:grid-cols-4">
                  <TabBtn active={tab === 'categories'} onClick={() => setTab('categories')} icon="🗂️" sub="7 תבניות">
                    קטגוריות
                  </TabBtn>
                  <TabBtn active={tab === 'formulas'} onClick={() => setTab('formulas')} icon="🔢" sub="טופ 10">
                    נוסחאות חמות
                  </TabBtn>
                  <TabBtn active={tab === 'insights'} onClick={() => setTab('insights')} icon="💡" sub="טופ 5">
                    משפטי הבנה
                  </TabBtn>
                  <TabBtn active={tab === 'recipes'} onClick={() => setTab('recipes')} icon="🍳" sub="צעד-אחר-צעד">
                    מתכון פתרון
                  </TabBtn>
                </div>
              )}
            </div>

            {tab === 'categories' ? (
            <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-6 py-5">
              <p className="text-sm text-slate-500">{categories.length} תבניות חוזרות · {total} שאלות · לחצו על שאלה כדי לפתוח את המבחן.</p>
              {categories.map((c, idx) => {
                const accent = ACCENTS[idx % ACCENTS.length]
                return (
                  <section key={c.id} className="overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
                    <div className={`flex items-center gap-3 bg-gradient-to-l to-white px-4 py-2.5 ${accent}`}>
                      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-white/70 text-xs font-black ring-1 ring-inset ring-current">{c.id}</span>
                      <h4 className="flex-1 text-sm font-bold text-slate-800">{c.titleHe}</h4>
                      <span className="shrink-0 rounded-full bg-white/70 px-2 py-0.5 text-xs font-bold">{c.instances.length}</span>
                    </div>
                    <div className="px-4 py-3">
                      <p className="mb-3 text-sm leading-relaxed text-slate-500"><RichText>{c.markerHe}</RichText></p>
                      <div className="flex flex-wrap gap-2">
                        {c.instances.map((inst, k) => {
                          const ex = examById(inst.examId)
                          const label = ex ? `${ex.year} ${MOED[ex.moed]}` : inst.examId
                          const chip = (
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600 transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700">
                              {label} · {inst.q} {ex && <span aria-hidden className="text-slate-400">↗</span>}
                            </span>
                          )
                          return ex ? (
                            <Link key={k} to={examViewPath(courseId, inst.examId)} onClick={onClose}>{chip}</Link>
                          ) : (
                            <span key={k}>{chip}</span>
                          )
                        })}
                      </div>
                    </div>
                  </section>
                )
              })}
            </div>
            ) : tab === 'formulas' ? (
              <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-6 py-5">
                <p className="text-sm text-slate-500">
                  <b>10 הנוסחאות הכי שמישות</b> — זוקקו מכל 14 פתרונות המבחנים, מדורגות מהכי שמיש לפחות.
                </p>
                {studyGuide?.formulas.map((f, k) => (
                  <div key={k} className="overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-3 border-b border-slate-100 bg-slate-50 px-4 py-2">
                      <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-emerald-600 text-xs font-black text-white">{k + 1}</span>
                      <h5 className="flex-1 text-sm font-bold text-slate-800">{f.titleHe}</h5>
                      <span className="shrink-0 rounded-full bg-white px-2.5 py-0.5 text-[11px] font-semibold text-slate-400 ring-1 ring-slate-200">{f.usageHe}</span>
                    </div>
                    <div className="px-4 py-3">
                      <div className="hide-scrollbar mb-2 overflow-x-auto rounded-xl border border-emerald-100 bg-emerald-50/50 px-4 py-3 text-center" dir="ltr">
                        <Tex block>{f.tex}</Tex>
                      </div>
                      <p className="text-sm leading-relaxed text-slate-600"><RichText>{f.detailHe}</RichText></p>
                    </div>
                  </div>
                ))}
              </div>
            ) : tab === 'insights' ? (
              <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-6 py-5">
                <p className="text-sm text-slate-500">
                  <b>5 משפטי ההבנה הכי שמישים</b> — ה"למה" מאחורי הנוסחאות. הפנמת אותם = הבנת רוב הפתרונות.
                </p>
                {studyGuide?.insights.map((ins, k) => (
                  <div key={k} className="rounded-2xl border border-slate-200 border-s-4 border-s-violet-400 bg-white p-4 shadow-sm">
                    <div className="mb-1 flex items-center gap-3">
                      <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-violet-600 text-xs font-black text-white">{k + 1}</span>
                      <h5 className="flex-1 text-sm font-bold text-slate-800">{ins.titleHe}</h5>
                      <span className="shrink-0 rounded-full bg-violet-50 px-2.5 py-0.5 text-[11px] font-semibold text-violet-500 ring-1 ring-violet-100">{ins.usageHe}</span>
                    </div>
                    <p className="text-sm leading-relaxed text-slate-600"><RichText>{ins.detailHe}</RichText></p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-6 py-5">
                {/* master 3-beat banner */}
                <div className="rounded-2xl border border-emerald-200 bg-gradient-to-l from-emerald-50 to-white p-4">
                  <p className="mb-3 text-sm font-bold text-emerald-800">כל שאלה נפתרת ב-3 פעימות — אותו מתכון תמיד:</p>
                  <div className="grid gap-2 sm:grid-cols-3">
                    {studyGuide?.masterBeats.map((b, k) => (
                      <div key={k} className="flex gap-2 rounded-xl bg-white/70 p-3 ring-1 ring-emerald-100">
                        <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-emerald-600 text-xs font-black text-white">{k + 1}</span>
                        <div>
                          <p className="text-sm font-bold text-slate-800">{b.titleHe}</p>
                          <p className="mt-0.5 text-xs leading-relaxed text-slate-500"><RichText>{b.textHe}</RichText></p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* per-template steppers */}
                {studyGuide?.recipes.map((r) => (
                  <div key={r.templateId} className="overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-3 border-b border-slate-100 bg-slate-50 px-4 py-2.5">
                      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-slate-800 text-xs font-black text-white">{r.templateId}</span>
                      <h5 className="flex-1 text-sm font-bold text-slate-800">{r.titleHe}</h5>
                      <span className="shrink-0 rounded-full bg-white px-2.5 py-0.5 text-[11px] font-semibold text-slate-400 ring-1 ring-slate-200">{r.countHe}</span>
                    </div>
                    <ol className="relative px-4 py-4">
                      {/* connector line (RTL: on the right, under the number circles) */}
                      <span className="absolute bottom-6 top-6 right-[27px] w-px bg-slate-200" aria-hidden />
                      {r.steps.map((s, k) => {
                        const meta = KIND_META[s.kind]
                        return (
                          <li key={k} className="relative flex gap-3 pb-4 last:pb-0">
                            <span className={`z-10 grid h-6 w-6 shrink-0 place-items-center rounded-full text-[11px] font-black text-white ${meta.dot}`}>{k + 1}</span>
                            <div className="flex-1">
                              <div className="mb-1 flex flex-wrap items-center gap-2">
                                <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${meta.chip}`}>{meta.he}</span>
                                <span className="text-sm leading-relaxed text-slate-700"><RichText>{s.textHe}</RichText></span>
                              </div>
                              {s.tex && (
                                <div className="hide-scrollbar overflow-x-auto rounded-lg bg-slate-50 px-3 py-1.5 text-slate-800 ring-1 ring-slate-100" dir="ltr">
                                  <Tex>{s.tex}</Tex>
                                </div>
                              )}
                            </div>
                          </li>
                        )
                      })}
                    </ol>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function TabBtn({ active, onClick, icon, sub, children }: { active: boolean; onClick: () => void; icon: string; sub: string; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-center transition ${
        active ? 'bg-white shadow ring-1 ring-emerald-200' : 'text-slate-500 hover:bg-white/60'
      }`}
    >
      <span className={`text-lg ${active ? '' : 'opacity-60'}`} aria-hidden>{icon}</span>
      <span className="flex flex-col items-start leading-tight">
        <span className={`text-sm font-bold ${active ? 'text-emerald-700' : 'text-slate-600'}`}>{children}</span>
        <span className={`text-[11px] ${active ? 'text-emerald-500' : 'text-slate-400'}`}>{sub}</span>
      </span>
    </button>
  )
}

const MOED: Record<ExamEntry['moed'], string> = { a: 'א׳', b: 'ב׳', c: 'ג׳', s: 'מיוחד' }
