import { useEffect, useMemo, useState } from 'react'
import type { AlgorithmInput, Frame } from '@/core/engine/types'
import { parseIntArray } from '@/core/engine/parseInput'
import DualView from '@/core/viz/DualView'
import { sortingAlgorithms } from './overview'

const RACE_PRESETS: { labelHe: string; array: number[]; noteHe?: string }[] = [
  { labelHe: 'ממוין (הכי דרמטי)', array: [1, 2, 3, 4, 5, 6, 7, 8], noteHe: 'מפיל את Quicksort ל-O(n²); Heapsort/אקראי נשארים יעילים.' },
  { labelHe: 'אקראי', array: [5, 3, 8, 4, 1, 7, 2, 6] },
  { labelHe: 'הפוך', array: [8, 7, 6, 5, 4, 3, 2, 1] },
]
const SEED = 20407
const BASE_MS = 650

function Icon({ d }: { d: string }) {
  return (
    <svg viewBox="0 0 24 24" width={20} height={20} fill="currentColor">
      <path d={d} />
    </svg>
  )
}
const PLAY = 'M8 5v14l11-7z'
const PAUSE = 'M6 5h4v14H6zM14 5h4v14h-4z'
const NEXT = 'M6 5l9 7-9 7zM17 5h2v14h-2z'
const PREV = 'M18 5l-9 7 9 7zM5 5h2v14H5z'
const RESET = 'M12 5V1L7 6l5 5V7a5 5 0 1 1-5 5H5a7 7 0 1 0 7-7z'

function prefixCounts(frames: Frame[]) {
  let c = 0
  let s = 0
  return frames.map((f) => {
    if (f.action?.kind === 'compare') c += 1
    else if (f.action?.kind === 'swap') s += 1
    return { c, s }
  })
}

/** Side-by-side race of two sorting algorithms on the SAME input. */
export default function AlgorithmRace() {
  const sorts = useMemo(() => sortingAlgorithms(), [])
  const [aId, setAId] = useState(sorts[0].spec.id)
  const [bId, setBId] = useState((sorts[1] ?? sorts[0]).spec.id)
  const [array, setArray] = useState<number[]>([1, 2, 3, 4, 5, 6, 7, 8])
  const [raw, setRaw] = useState('1, 2, 3, 4, 5, 6, 7, 8')
  const [err, setErr] = useState<string | null>(null)

  const a = sorts.find((s) => s.spec.id === aId)!.spec
  const b = sorts.find((s) => s.spec.id === bId)!.spec
  const input: AlgorithmInput = useMemo(() => ({ array, extra: { seed: SEED } }), [array])
  const framesA = useMemo(() => a.run(input), [a, input])
  const framesB = useMemo(() => b.run(input), [b, input])
  const prefA = useMemo(() => prefixCounts(framesA), [framesA])
  const prefB = useMemo(() => prefixCounts(framesB), [framesB])
  const maxLen = Math.max(framesA.length, framesB.length)

  const [index, setIndex] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [speed, setSpeed] = useState(1)

  useEffect(() => {
    setIndex(0)
    setPlaying(false)
  }, [framesA, framesB])

  useEffect(() => {
    if (!playing) return
    const id = setInterval(() => setIndex((i) => Math.min(i + 1, maxLen - 1)), BASE_MS / speed)
    return () => clearInterval(id)
  }, [playing, speed, maxLen])
  useEffect(() => {
    if (index >= maxLen - 1) setPlaying(false)
  }, [index, maxLen])

  function applyArray(arr: number[]) {
    setArray(arr)
    setRaw(arr.join(', '))
    setErr(null)
  }
  function runRaw() {
    const res = parseIntArray(raw, { min: 2, max: 16 })
    if (!res.ok) {
      setErr(res.error)
      return
    }
    applyArray(res.value.array)
  }

  const pct = maxLen > 1 ? (index / (maxLen - 1)) * 100 : 0
  const done = index >= maxLen - 1
  const totalA = prefA[prefA.length - 1] ?? { c: 0, s: 0 }
  const totalB = prefB[prefB.length - 1] ?? { c: 0, s: 0 }

  return (
    <div className="flex flex-col gap-4">
      {/* controls */}
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-card">
        <div className="grid gap-3 sm:grid-cols-2">
          <Picker label="אלגוריתם א'" value={aId} onChange={setAId} sorts={sorts} accent="sky" />
          <Picker label="אלגוריתם ב'" value={bId} onChange={setBId} sorts={sorts} accent="violet" />
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <input
            dir="ltr"
            value={raw}
            onChange={(e) => setRaw(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && runRaw()}
            className="ltr flex-1 rounded-xl border border-slate-300 px-4 py-2 font-mono text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
          />
          <button onClick={runRaw} className="rounded-xl bg-slate-800 px-5 py-2 text-sm font-medium text-white hover:bg-slate-900">
            הרצה
          </button>
        </div>
        {err && <p className="text-sm text-rose-600">{err}</p>}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-slate-400">קלט לדוגמה:</span>
          {RACE_PRESETS.map((p) => (
            <button
              key={p.labelHe}
              onClick={() => applyArray(p.array)}
              title={p.noteHe}
              className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 transition hover:bg-sky-100 hover:text-sky-700"
            >
              {p.labelHe}
            </button>
          ))}
        </div>
      </div>

      {/* two tracks */}
      <div className="grid min-w-0 gap-4 lg:grid-cols-2">
        <Track spec={a} frame={framesA[Math.min(index, framesA.length - 1)]} count={prefA[Math.min(index, prefA.length - 1)] ?? { c: 0, s: 0 }} accent="sky" finished={index >= framesA.length - 1} />
        <Track spec={b} frame={framesB[Math.min(index, framesB.length - 1)]} count={prefB[Math.min(index, prefB.length - 1)] ?? { c: 0, s: 0 }} accent="violet" finished={index >= framesB.length - 1} />
      </div>

      {/* transport + scrubber */}
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-card">
        <div dir="ltr" className="ltr flex items-center gap-3">
          <input
            type="range"
            min={0}
            max={Math.max(0, maxLen - 1)}
            value={index}
            onChange={(e) => setIndex(Number(e.target.value))}
            className="scrubber h-3 w-full cursor-pointer appearance-none rounded-full ring-1 ring-slate-200"
            style={{ background: `linear-gradient(to right, #0ea5e9 ${pct}%, #e2e8f0 ${pct}%)` }}
            aria-label="מיקום במירוץ"
          />
          <span className="shrink-0 font-mono text-xs tabular-nums text-slate-500">{index + 1}/{maxLen}</span>
        </div>
        <div dir="ltr" className="flex items-center justify-center gap-1">
          <CtlBtn onClick={() => { setIndex(0); setPlaying(false) }} disabled={index === 0} d={RESET} />
          <CtlBtn onClick={() => { setIndex((i) => Math.max(0, i - 1)); setPlaying(false) }} disabled={index === 0} d={PREV} />
          <button onClick={() => setPlaying((p) => (done ? (setIndex(0), true) : !p))} className="grid h-12 w-12 place-items-center rounded-full bg-sky-500 text-white shadow-lg shadow-sky-500/30 hover:bg-sky-600">
            <Icon d={playing ? PAUSE : PLAY} />
          </button>
          <CtlBtn onClick={() => { setIndex((i) => Math.min(maxLen - 1, i + 1)); setPlaying(false) }} disabled={done} d={NEXT} />
          <div className="ms-2 flex items-center gap-0.5 rounded-full bg-slate-100 p-0.5">
            {[0.5, 1, 2, 4].map((s) => (
              <button key={s} onClick={() => setSpeed(s)} className={`rounded-full px-2 py-0.5 font-mono text-[11px] ${speed === s ? 'bg-white text-sky-600 shadow' : 'text-slate-500'}`}>{s}×</button>
            ))}
          </div>
        </div>
        {done && (
          <div className="rounded-xl bg-slate-50 p-3 text-center text-sm text-slate-700">
            סיום: <b dir="ltr" className="font-mono">{a.titleEn}</b> — {totalA.c} השוואות · {totalA.s} החלפות; {' '}
            <b dir="ltr" className="font-mono">{b.titleEn}</b> — {totalB.c} השוואות · {totalB.s} החלפות.
          </div>
        )}
      </div>
    </div>
  )
}

function Picker({ label, value, onChange, sorts, accent }: { label: string; value: string; onChange: (v: string) => void; sorts: ReturnType<typeof sortingAlgorithms>; accent: 'sky' | 'violet' }) {
  const ring = accent === 'sky' ? 'border-sky-500 bg-sky-500' : 'border-violet-500 bg-violet-500'
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs font-medium text-slate-400">{label}</span>
      <div className="flex flex-wrap gap-1.5">
        {sorts.map((s) => (
          <button
            key={s.spec.id}
            onClick={() => onChange(s.spec.id)}
            className={`rounded-full border px-3 py-1 text-xs font-medium transition ${value === s.spec.id ? `${ring} text-white shadow` : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'}`}
            title={`שיעור ${s.lecture.number}`}
          >
            {s.spec.titleEn}
          </button>
        ))}
      </div>
    </div>
  )
}

function Track({ spec, frame, count, accent, finished }: { spec: ReturnType<typeof sortingAlgorithms>[number]['spec']; frame: Frame; count: { c: number; s: number }; accent: 'sky' | 'violet'; finished: boolean }) {
  const dot = accent === 'sky' ? '#0ea5e9' : '#a855f7'
  return (
    <div className="flex min-w-0 flex-col gap-2">
      <div className="flex items-center justify-between gap-2">
        <span className="flex items-center gap-2 font-semibold text-slate-800">
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: dot }} />
          <span dir="ltr" className="font-mono text-sm">{spec.titleEn}</span>
          {finished && <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">✓ ממוין</span>}
        </span>
        <span className="font-mono text-xs tabular-nums text-slate-500">{count.c} השוואות · {count.s} החלפות</span>
      </div>
      <DualView frame={frame} views={['array']} />
    </div>
  )
}

function CtlBtn({ onClick, disabled, d }: { onClick: () => void; disabled?: boolean; d: string }) {
  return (
    <button onClick={onClick} disabled={disabled} className="grid h-9 w-9 place-items-center rounded-full text-slate-600 transition hover:bg-slate-100 disabled:opacity-30">
      <Icon d={d} />
    </button>
  )
}
