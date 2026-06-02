import { motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import type { Frame, WatchVar } from '@/core/engine/types'
import { rgba, TONE, toneKey, varsForFrame } from './watchVars'

const ROW_H = 28 // px — fixed so arrow endpoints can be computed without measuring

/**
 * A Python-Tutor-style box of watched variables, overlaid in a corner of the
 * illustration. Layout is STABLE: each variable keeps a fixed row for the whole
 * run (append-only by first appearance), so values update in place without the
 * list ever reflowing. Inactive variables are dimmed (last-known value). When a
 * variable was just assigned from another (`from`), an arrow links the two rows.
 */
export default function WatchPanel({
  frames,
  index,
  jumped,
  wide,
}: {
  frames: Frame[]
  index: number
  jumped: boolean
  /** Fill the container width (for docked side placement) instead of a fixed pill. */
  wide?: boolean
}) {
  const [open, setOpen] = useState(true)

  // Fixed display order + per-variable metadata, derived once from the whole run.
  const { order, meta } = useMemo(() => {
    const order: string[] = []
    const meta = new Map<string, { kind?: WatchVar['kind']; tone?: WatchVar['tone'] }>()
    for (const f of frames) {
      for (const v of varsForFrame(f)) {
        if (!meta.has(v.name)) {
          order.push(v.name)
          meta.set(v.name, { kind: v.kind, tone: v.tone })
        }
      }
    }
    return { order, meta }
  }, [frames])

  // Last-known value of each variable up to (and including) every frame.
  const knownAt = useMemo(() => {
    const out: Map<string, number>[] = []
    const last = new Map<string, number>()
    for (const f of frames) {
      for (const v of varsForFrame(f)) last.set(v.name, v.value)
      out.push(new Map(last))
    }
    return out
  }, [frames])

  const frame = frames[index]
  const activeVars = frame ? varsForFrame(frame) : []
  const activeMap = new Map(activeVars.map((v) => [v.name, v.value]))
  const known = knownAt[index] ?? new Map<string, number>()
  const prev = index > 0 ? frames[index - 1] : undefined
  const prevMap = new Map((!jumped && prev ? varsForFrame(prev) : []).map((v) => [v.name, v.value]))

  // Rows that have appeared so far, in their fixed order (never reorders).
  const rows = order.filter((name) => known.has(name))
  if (!frame || rows.length === 0) return null

  const rowIndex = new Map(rows.map((name, i) => [name, i]))
  const toneOf = (name: string) => TONE[toneKey({ name, value: 0, tone: meta.get(name)?.tone })]

  // Relationship arrows: source `from` → this variable, both currently shown.
  const arrows = activeVars
    .filter((v) => v.from && rowIndex.has(v.name) && rowIndex.has(v.from))
    .map((v) => ({
      key: `${v.from}->${v.name}`,
      y1: rowIndex.get(v.from!)! * ROW_H + ROW_H / 2,
      y2: rowIndex.get(v.name)! * ROW_H + ROW_H / 2,
      color: toneOf(v.name),
    }))

  return (
    <div
      className={`pointer-events-auto shrink-0 overflow-hidden rounded-xl border border-slate-200/70 bg-white/90 shadow-lg ring-1 ring-black/5 backdrop-blur-md ${
        !open ? 'w-auto' : wide ? 'w-full' : 'w-[148px] sm:w-[200px]'
      }`}
    >
      <div
        className={`flex items-center justify-between gap-2 bg-gradient-to-l from-slate-50 to-white px-2.5 py-1.5 ${
          open ? 'border-b border-slate-200/70' : ''
        }`}
      >
        <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">משתנים</span>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? 'צמצום חלון המשתנים' : 'הרחבת חלון המשתנים'}
          title={open ? 'צמצום' : 'הרחבה'}
          className="flex h-5 w-5 items-center justify-center rounded-md text-slate-400 transition hover:bg-slate-200/70 hover:text-slate-700"
        >
          {open ? '−' : '+'}
        </button>
      </div>
      {wide ? (
        // Docked variant: compact 2-column grid so a tall list still fits.
        <div
          className="grid grid-cols-2 gap-x-3 gap-y-0.5 px-2.5 pb-1.5"
          style={{ direction: 'ltr', display: open ? undefined : 'none' }}
        >
          {rows.map(renderRow)}
        </div>
      ) : (
        // Overlay variant: single column with relationship arrows down the gutter.
        <div className="relative pb-1 pl-5 pr-2.5" style={{ direction: 'ltr', display: open ? undefined : 'none' }}>
          {arrows.length > 0 && (
            <svg className="pointer-events-none absolute inset-0 h-full w-full overflow-visible">
              <defs>
                {arrows.map((a) => (
                  <marker
                    key={`m-${a.key}`}
                    id={`wp-arrow-${a.key}`}
                    viewBox="0 0 8 8"
                    refX="6"
                    refY="4"
                    markerWidth="6"
                    markerHeight="6"
                    orient="auto-start-reverse"
                  >
                    <path d="M0,0 L8,4 L0,8 Z" fill={a.color} />
                  </marker>
                ))}
              </defs>
              {arrows.map((a) => (
                <path
                  key={a.key}
                  d={`M 9,${a.y1} Q 1,${(a.y1 + a.y2) / 2} 9,${a.y2}`}
                  fill="none"
                  stroke={a.color}
                  strokeWidth={1.5}
                  markerEnd={`url(#wp-arrow-${a.key})`}
                  opacity={0.85}
                />
              ))}
            </svg>
          )}
          {rows.map(renderRow)}
        </div>
      )}
    </div>
  )

  function renderRow(name: string) {
    const active = activeMap.has(name)
    const value = active ? activeMap.get(name)! : known.get(name)!
    const hex = toneOf(name)
    const isIndex = meta.get(name)?.kind === 'index'
    const cell = active && isIndex ? frame.array[value] : undefined
    const showCell = typeof cell === 'number' && Number.isFinite(cell)
    const changed = !jumped && active && prevMap.has(name) && prevMap.get(name) !== value
    return (
      <motion.div
        key={name}
        animate={{ backgroundColor: changed ? rgba(hex, 0.2) : 'rgba(0,0,0,0)' }}
        transition={{ duration: 0.4 }}
        className={`flex min-w-0 items-center gap-1 rounded font-mono text-[12px] ${
          wide ? 'px-1' : '[&:not(:last-child)]:border-b [&:not(:last-child)]:border-slate-100/80'
        }`}
        style={{ height: ROW_H, opacity: active ? 1 : 0.4 }}
      >
        {/* colored accent dot for the variable */}
        <span
          className="mr-0.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full"
          style={{ backgroundColor: hex }}
        />
        <b className="shrink-0 font-bold" style={{ color: hex }}>
          {name}
        </b>
        <span className="shrink-0 text-slate-400">=</span>
        <span className="shrink-0 font-bold" style={{ color: hex }}>
          {value}
        </span>
        {showCell && (
          <>
            {/* arrow showing the index points at its array cell: i → A[i] */}
            <span className="shrink-0 px-0.5 text-[13px] leading-none" style={{ color: hex }}>
              →
            </span>
            <span className="truncate text-[10px] text-slate-400">
              A[{value}]=<span className="text-slate-600">{cell}</span>
            </span>
          </>
        )}
      </motion.div>
    )
  }
}
