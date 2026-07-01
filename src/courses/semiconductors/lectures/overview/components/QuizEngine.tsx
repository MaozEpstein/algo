import { useMemo, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { usePrintMode } from '@/core/platform/printMode'
import Tex from '@/core/components/Tex'
import type { QuizQuestion } from '../data/quiz'
import DeepLinkChip from './DeepLinkChip'

interface Answer {
  selected: number[]
  correct: boolean
}

const correctSet = (q: QuizQuestion) => q.options.map((o, i) => (o.correct ? i : -1)).filter((i) => i >= 0)
const isCorrect = (q: QuizQuestion, selected: number[]) => {
  const want = correctSet(q).sort().join(',')
  const got = [...selected].sort().join(',')
  return want === got
}

export default function QuizEngine({ questions }: { questions: QuizQuestion[] }) {
  const reduce = useReducedMotion()
  const print = usePrintMode()
  const [cur, setCur] = useState(0)
  const [sel, setSel] = useState<number[]>([])
  const [answers, setAnswers] = useState<Record<number, Answer>>({})
  const [done, setDone] = useState(false)

  const q = questions[cur]
  const answered = answers[cur]
  const score = useMemo(() => Object.values(answers).filter((a) => a.correct).length, [answers])

  if (print) return <QuizPrint questions={questions} />

  const toggle = (i: number) => {
    if (answered) return
    setSel((s) => (q.kind === 'single' ? [i] : s.includes(i) ? s.filter((x) => x !== i) : [...s, i]))
  }
  const submit = () => {
    if (!sel.length || answered) return
    setAnswers((a) => ({ ...a, [cur]: { selected: sel, correct: isCorrect(q, sel) } }))
  }
  const goto = (i: number) => {
    setCur(i)
    setSel(answers[i]?.selected ?? [])
  }
  const next = () => (cur === questions.length - 1 ? setDone(true) : goto(cur + 1))
  const reset = () => {
    setAnswers({})
    setSel([])
    setCur(0)
    setDone(false)
  }

  if (done) {
    const pct = Math.round((score / questions.length) * 100)
    const tier =
      pct === 100 ? { emoji: '🏆', msg: 'מושלם! חיברת את כל הקורס לתמונה אחת.' }
        : pct >= 75 ? { emoji: '🎉', msg: 'מצוין! ההבנה החוצה-קורסית שלך חזקה.' }
          : pct >= 50 ? { emoji: '👍', msg: 'לא רע — כדאי לחזור על הגשרים שפספסת.' }
            : { emoji: '📚', msg: 'שווה סבב חזרה — לחצו על הקישורים למקורות.' }
    return (
      <div className="flex flex-col gap-4">
        <motion.div
          initial={reduce ? false : { scale: 0.92, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="rounded-2xl border border-slate-200 bg-gradient-to-b from-sky-50 to-white p-6 text-center shadow-card"
        >
          <div className="text-5xl">{tier.emoji}</div>
          <div className="mt-2 text-3xl font-extrabold text-slate-800">{score}<span className="text-slate-400">/{questions.length}</span></div>
          <div className="mx-auto mt-3 h-2.5 w-56 overflow-hidden rounded-full bg-slate-200">
            <motion.div className="h-full rounded-full bg-emerald-500" initial={reduce ? false : { width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.6 }} />
          </div>
          <p className="mt-3 leading-relaxed text-slate-600">{tier.msg}</p>
          <button onClick={reset} className="mt-4 rounded-xl bg-slate-800 px-5 py-2 text-sm font-bold text-white transition hover:bg-slate-700">↻ נסה שוב</button>
        </motion.div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card">
          <h4 className="mb-3 text-sm font-bold text-slate-700">סקירה</h4>
          <ul className="flex flex-col gap-2">
            {questions.map((qq, i) => (
              <li key={qq.id} className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2">
                <button onClick={() => { setDone(false); goto(i) }} className="flex min-w-0 items-center gap-2 text-start">
                  <span aria-hidden className={answers[i]?.correct ? 'text-emerald-500' : 'text-rose-500'}>{answers[i]?.correct ? '✓' : '✗'}</span>
                  <span className="truncate text-sm text-slate-700">{qq.topic}</span>
                </button>
                {qq.lectureId && <DeepLinkChip lectureId={qq.lectureId} tab={qq.tab}>מקור</DeepLinkChip>}
              </li>
            ))}
          </ul>
        </div>
      </div>
    )
  }

  const pct = ((cur + (answered ? 1 : 0)) / questions.length) * 100
  return (
    <div className="flex flex-col gap-3">
      {/* chrome: progress + counter + score */}
      <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-card">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="font-semibold text-slate-600">שאלה {cur + 1}/{questions.length}</span>
          <span className="rounded-full bg-emerald-50 px-3 py-0.5 text-xs font-bold text-emerald-700">ניקוד {score}</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
          <motion.div className="h-full rounded-full bg-sky-500" animate={{ width: `${pct}%` }} transition={reduce ? { duration: 0 } : { duration: 0.4 }} />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={cur}
          initial={reduce ? false : { opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={reduce ? undefined : { opacity: 0, x: -24 }}
          transition={{ duration: 0.25 }}
          className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card"
        >
          <div className="mb-1 flex items-center gap-2">
            <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-bold text-indigo-700">{q.topic}</span>
            {q.kind === 'multi' && <span className="text-xs text-slate-400">בחרו את כל הנכונים</span>}
          </div>
          <p className="mb-3 text-base font-semibold leading-relaxed text-slate-800">{q.prompt}</p>

          <div className="flex flex-col gap-2">
            {q.options.map((o, i) => {
              const chosen = sel.includes(i)
              let cls = 'border-slate-200 bg-white hover:bg-slate-50'
              let mark: string | null = q.kind === 'multi' ? (chosen ? '☑' : '☐') : chosen ? '◉' : '○'
              if (answered) {
                if (o.correct) { cls = 'border-emerald-400 bg-emerald-50'; mark = '✓' }
                else if (chosen) { cls = 'border-rose-400 bg-rose-50'; mark = '✗' }
                else { cls = 'border-slate-200 bg-white opacity-60'; mark = q.kind === 'multi' ? '☐' : '○' }
              } else if (chosen) {
                cls = 'border-sky-400 bg-sky-50 ring-1 ring-sky-300'
              }
              return (
                <button
                  key={i}
                  onClick={() => toggle(i)}
                  disabled={!!answered}
                  className={`flex items-start gap-2.5 rounded-xl border px-3 py-2.5 text-start text-sm leading-relaxed text-slate-700 transition ${cls}`}
                >
                  <span aria-hidden className="mt-0.5 shrink-0 font-bold">{mark}</span>
                  <span>{o.text}</span>
                </button>
              )
            })}
          </div>

          {/* explanation after reveal */}
          <AnimatePresence>
            {answered && (
              <motion.div
                initial={reduce ? false : { height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                className="overflow-hidden"
              >
                <div className={`mt-3 rounded-xl border-s-4 p-3 leading-relaxed ${answered.correct ? 'border-emerald-500 bg-emerald-50/60' : 'border-rose-500 bg-rose-50/60'}`}>
                  <div className="mb-1 flex items-center gap-2 font-bold text-slate-800">
                    <span aria-hidden>{answered.correct ? '✓' : '✗'}</span>
                    {answered.correct ? 'נכון!' : 'לא מדויק'}
                  </div>
                  <p className="text-sm text-slate-600">{q.explanation}</p>
                  {q.lectureId && <div className="mt-2"><DeepLinkChip lectureId={q.lectureId} tab={q.tab}>לשיעור-המקור</DeepLinkChip></div>}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* controls */}
          <div className="mt-4 flex items-center justify-between">
            <button
              onClick={() => goto(cur - 1)}
              disabled={cur === 0}
              className="rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-200 disabled:opacity-40"
            >‹ הקודם</button>
            {!answered ? (
              <button
                onClick={submit}
                disabled={!sel.length}
                className="rounded-lg bg-sky-600 px-5 py-1.5 text-sm font-bold text-white transition hover:bg-sky-700 disabled:opacity-40"
              >בדוק</button>
            ) : (
              <button
                onClick={next}
                className="rounded-lg bg-emerald-600 px-5 py-1.5 text-sm font-bold text-white transition hover:bg-emerald-700"
              >{cur === questions.length - 1 ? 'לתוצאות ›' : 'הבא ›'}</button>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
      <Tex>{'\\;'}</Tex>
    </div>
  )
}

/** Static print fallback: all questions with the correct answers marked + explanations. */
function QuizPrint({ questions }: { questions: QuizQuestion[] }) {
  return (
    <div className="flex flex-col gap-4">
      {questions.map((q, i) => (
        <div key={q.id} className="break-inside-avoid rounded-xl border border-slate-200 p-3">
          <p className="font-semibold text-slate-800">{i + 1}. {q.prompt}</p>
          <ul className="mt-2 flex flex-col gap-1">
            {q.options.map((o, j) => (
              <li key={j} className={`text-sm ${o.correct ? 'font-semibold text-emerald-700' : 'text-slate-600'}`}>
                {o.correct ? '✓ ' : '○ '}{o.text}
              </li>
            ))}
          </ul>
          <p className="mt-2 text-sm text-slate-600">{q.explanation}</p>
        </div>
      ))}
    </div>
  )
}
