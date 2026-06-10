import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Tex from '@/core/components/Tex'
import RichText from '@/core/components/RichText'
import { OPEN_CALCULATOR } from '@/core/platform/types'
import Slider from './Slider'
import { CALCULATORS, type CalcSpec } from '../lib/calculators'

type Vals = Record<string, number>
const defaultsFor = (c: CalcSpec): Vals => Object.fromEntries(c.inputs.map((i) => [i.key, i.default]))
const initialState = (): Record<string, Vals> => Object.fromEntries(CALCULATORS.map((c) => [c.id, defaultsFor(c)]))
const fmt = (log: boolean | undefined, v: number, unit: string) =>
  log ? `10^${v.toFixed(1)} ${unit}` : `${Number.isInteger(v) ? v : v.toFixed(2)} ${unit}`

/** The course's live calculator — a separate modal from the (untouched) formula sheet. */
export default function Calculator() {
  const [open, setOpen] = useState(false)
  const [state, setState] = useState<Record<string, Vals>>(initialState)

  useEffect(() => {
    const onOpen = () => setOpen(true)
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener(OPEN_CALCULATOR, onOpen)
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener(OPEN_CALCULATOR, onOpen)
      window.removeEventListener('keydown', onKey)
    }
  }, [])

  const setVal = (cid: string, key: string, v: number) => setState((s) => ({ ...s, [cid]: { ...s[cid], [key]: v } }))
  const loadPreset = (c: CalcSpec, vals: Vals) => setState((s) => ({ ...s, [c.id]: { ...defaultsFor(c), ...vals } }))

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-start justify-center bg-slate-900/40 p-4 pt-[6vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setOpen(false)}
        >
          <motion.div
            className="flex max-h-[88vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl bg-slate-50 shadow-2xl"
            initial={{ scale: 0.96, y: 12 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.96, y: 12 }}
            onClick={(e) => e.stopPropagation()}
            dir="rtl"
          >
            <div className="sticky top-0 z-10 flex shrink-0 items-center justify-between gap-4 border-b border-indigo-100 bg-gradient-to-l from-indigo-50 to-white px-6 py-4">
              <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900"><span aria-hidden>🧮</span>מחשבון חי</h3>
              <button onClick={() => setOpen(false)} className="grid h-8 w-8 place-items-center rounded-full text-slate-400 transition hover:bg-white hover:text-slate-600" aria-label="סגירה">✕</button>
            </div>

            <div className="grid min-h-0 flex-1 gap-3 overflow-auto p-5 sm:grid-cols-2">
              {CALCULATORS.map((c) => {
                const vals = state[c.id]
                const results = c.compute(vals)
                return (
                  <div key={c.id} className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <div>
                      <p className="text-sm font-bold text-slate-700">{c.titleHe}</p>
                      <div className="mt-1 overflow-x-auto rounded-lg bg-slate-50 px-3 py-2 text-center"><Tex block>{c.tex}</Tex></div>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {c.presets.map((p) => (
                        <button
                          key={p.label}
                          onClick={() => loadPreset(c, p.vals)}
                          className="rounded-full border border-indigo-200 bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700 transition hover:bg-indigo-100"
                        >
                          {p.label}
                        </button>
                      ))}
                    </div>

                    <div className="flex flex-col gap-2">
                      {c.inputs.map((inp) => (
                        <Slider
                          key={inp.key}
                          label={<RichText>{inp.label}</RichText>}
                          value={vals[inp.key]}
                          min={inp.min}
                          max={inp.max}
                          step={inp.step}
                          onChange={(v) => setVal(c.id, inp.key, v)}
                          display={fmt(inp.log, vals[inp.key], inp.unit)}
                        />
                      ))}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {results.map((r) => (
                        <div key={r.label} className="flex-1 rounded-xl border-s-4 border-emerald-300 bg-emerald-50/60 px-3 py-2 text-center">
                          <div className="text-xs font-semibold text-slate-500"><RichText>{r.label}</RichText></div>
                          <div className="font-mono text-base font-bold text-slate-800" dir="ltr">{r.value}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="shrink-0 border-t border-slate-100 px-5 py-2 text-center text-[11px] text-slate-400">
              חישוב חי מבוסס על נוסחאות הקורס · בחרו "ערכים מוכרים" או גררו את הסליידרים
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
