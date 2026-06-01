import { useEffect, useMemo, useState } from 'react'
import type { Frame, PseudocodeBlock, ViewKind } from '@/engine/types'
import DualView from '@/viz/DualView'
import CodePanel from './panels/CodePanel'
import NarrationBar from './panels/NarrationBar'

/**
 * A self-contained playback widget for embedding a guided visualization inside a
 * custom page (e.g. an explainer tab). Unlike PlaybackStage it uses LOCAL state
 * (no global player store, no global hotkeys) so several can coexist on a page.
 * Reuses the pure panels: NarrationBar, DualView, CodePanel.
 */
interface Props {
  frames: Frame[]
  pseudocode: PseudocodeBlock[]
  titleHe: string
  views?: ViewKind[]
  /** Show the comparisons/swaps cost readout (for sorts). */
  showCost?: boolean
}

const BASE_MS = 1000
const PLAY = 'M8 5v14l11-7z'
const PAUSE = 'M6 5h4v14H6zM14 5h4v14h-4z'
const NEXT = 'M6 5l9 7-9 7zM17 5h2v14h-2z'
const PREV = 'M18 5l-9 7 9 7zM5 5h2v14H5z'
const RESET = 'M12 5V1L7 6l5 5V7a5 5 0 1 1-5 5H5a7 7 0 1 0 7-7z'

function Icon({ d }: { d: string }) {
  return (
    <svg viewBox="0 0 24 24" width={18} height={18} fill="currentColor">
      <path d={d} />
    </svg>
  )
}

export default function LocalPlayer({ frames, pseudocode, titleHe, views = ['array'], showCost }: Props) {
  const [index, setIndex] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [speed, setSpeed] = useState(1)
  const [jumped, setJumped] = useState(false)
  const maxLen = frames.length

  // reset when the frame list changes (new input / preset)
  useEffect(() => {
    setIndex(0)
    setPlaying(false)
  }, [frames])

  useEffect(() => {
    if (!playing) return
    const id = setInterval(() => setIndex((i) => Math.min(i + 1, maxLen - 1)), BASE_MS / speed)
    return () => clearInterval(id)
  }, [playing, speed, maxLen])
  useEffect(() => {
    if (index >= maxLen - 1) setPlaying(false)
  }, [index, maxLen])

  const cost = useMemo(() => {
    let c = 0
    let s = 0
    for (let k = 0; k <= Math.min(index, maxLen - 1); k++) {
      const a = frames[k]?.action
      if (a?.kind === 'compare') c += 1
      else if (a?.kind === 'swap') s += 1
    }
    return { c, s }
  }, [frames, index, maxLen])

  const frame = frames[Math.min(index, maxLen - 1)]
  if (!frame) return null
  const pct = maxLen > 1 ? (index / (maxLen - 1)) * 100 : 0
  const done = index >= maxLen - 1
  const jump = (i: number) => {
    setJumped(true)
    setIndex(i)
    setPlaying(false)
  }

  return (
    <div className="flex flex-col gap-3">
      <NarrationBar frame={frame} />
      <div className="grid gap-3 lg:grid-cols-[1.6fr_1fr]">
        <div className="min-h-[300px] min-w-0 rounded-2xl">
          <DualView frame={frame} views={views} instant={jumped} />
        </div>
        <CodePanel blocks={pseudocode} frame={frame} mainBlockId={pseudocode[0].id} mainTitleHe={titleHe} />
      </div>

      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-card">
        <div dir="ltr" className="ltr flex items-center gap-3">
          <input
            type="range"
            min={0}
            max={Math.max(0, maxLen - 1)}
            value={index}
            onChange={(e) => jump(Number(e.target.value))}
            className="scrubber h-3 w-full cursor-pointer appearance-none rounded-full ring-1 ring-slate-200"
            style={{ background: `linear-gradient(to right, #0ea5e9 ${pct}%, #e2e8f0 ${pct}%)` }}
            aria-label="מיקום"
          />
          <span className="shrink-0 font-mono text-xs tabular-nums text-slate-500">
            {index + 1}/{maxLen}
          </span>
        </div>
        <div dir="ltr" className="flex items-center justify-center gap-1">
          <Ctl onClick={() => jump(0)} disabled={index === 0} d={RESET} />
          <Ctl onClick={() => jump(Math.max(0, index - 1))} disabled={index === 0} d={PREV} />
          <button
            onClick={() => {
              if (done) {
                setIndex(0)
                setJumped(false)
                setPlaying(true)
              } else {
                setJumped(false)
                setPlaying((p) => !p)
              }
            }}
            className="grid h-12 w-12 place-items-center rounded-full bg-sky-500 text-white shadow-lg shadow-sky-500/30 transition hover:bg-sky-600"
          >
            <Icon d={playing ? PAUSE : PLAY} />
          </button>
          <Ctl onClick={() => jump(Math.min(maxLen - 1, index + 1))} disabled={done} d={NEXT} />
          <div className="ms-2 flex items-center gap-0.5 rounded-full bg-slate-100 p-0.5">
            {[0.5, 1, 2, 4].map((s) => (
              <button
                key={s}
                onClick={() => setSpeed(s)}
                className={`rounded-full px-2 py-0.5 font-mono text-[11px] ${
                  speed === s ? 'bg-white text-sky-600 shadow' : 'text-slate-500'
                }`}
              >
                {s}×
              </button>
            ))}
          </div>
        </div>
        {showCost && (
          <div className="border-t border-slate-100 pt-2 text-center font-mono text-xs tabular-nums text-slate-500">
            {cost.c} השוואות · {cost.s} החלפות
          </div>
        )}
      </div>
    </div>
  )
}

function Ctl({ onClick, disabled, d }: { onClick: () => void; disabled?: boolean; d: string }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="grid h-9 w-9 place-items-center rounded-full text-slate-600 transition hover:bg-slate-100 disabled:opacity-30"
    >
      <Icon d={d} />
    </button>
  )
}
