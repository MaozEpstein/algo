import { useEffect } from 'react'
import { usePlayerStore } from './usePlayerStore'

const SPEEDS = [0.5, 1, 2, 4]

function Icon({ path, label }: { path: string; label: string }) {
  return (
    <svg viewBox="0 0 24 24" width={22} height={22} aria-label={label} fill="currentColor">
      <path d={path} />
    </svg>
  )
}

const PLAY = 'M8 5v14l11-7z'
const PAUSE = 'M6 5h4v14H6zM14 5h4v14h-4z'
const STEP_NEXT = 'M6 5l9 7-9 7zM17 5h2v14h-2z'
const STEP_PREV = 'M18 5l-9 7 9 7zM5 5h2v14H5z'
const RESET = 'M12 5V1L7 6l5 5V7a5 5 0 1 1-5 5H5a7 7 0 1 0 7-7z'

export default function PlayerControls() {
  const { index, frames, playing, speed, toggle, stepFwd, stepBack, seek, setSpeed, reset } =
    usePlayerStore()
  const total = frames.length
  const atEnd = index >= total - 1

  // keyboard: space=toggle, ArrowRight/Left=step (physical, not mirrored)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement
      if (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA') return
      if (e.code === 'Space') {
        e.preventDefault()
        usePlayerStore.getState().toggle()
      } else if (e.code === 'ArrowRight') {
        usePlayerStore.getState().stepFwd()
      } else if (e.code === 'ArrowLeft') {
        usePlayerStore.getState().stepBack()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const btn =
    'grid place-items-center rounded-full text-slate-700 transition hover:bg-slate-100 disabled:opacity-30'

  return (
    <div className="ltr flex flex-col gap-3" dir="ltr">
      {/* scrubber */}
      <div className="flex items-center gap-3">
        <input
          type="range"
          min={0}
          max={Math.max(0, total - 1)}
          value={index}
          onChange={(e) => seek(Number(e.target.value))}
          className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-sky-500"
          aria-label="מיקום בהרצה"
        />
        <span className="shrink-0 font-mono text-xs tabular-nums text-slate-500">
          {total ? index + 1 : 0}/{total}
        </span>
      </div>

      {/* transport */}
      <div className="flex flex-wrap items-center justify-center gap-1">
        <button className={`${btn} h-10 w-10`} onClick={reset} title="התחלה" disabled={index === 0}>
          <Icon path={RESET} label="איפוס" />
        </button>
        <button className={`${btn} h-10 w-10`} onClick={stepBack} title="צעד אחורה" disabled={index === 0}>
          <Icon path={STEP_PREV} label="אחורה" />
        </button>
        <button
          className="grid h-14 w-14 place-items-center rounded-full bg-sky-500 text-white shadow-lg shadow-sky-500/30 transition hover:bg-sky-600"
          onClick={toggle}
          title={playing ? 'השהיה' : 'נגן'}
        >
          <Icon path={playing ? PAUSE : PLAY} label={playing ? 'השהיה' : 'נגן'} />
        </button>
        <button className={`${btn} h-10 w-10`} onClick={stepFwd} title="צעד קדימה" disabled={atEnd}>
          <Icon path={STEP_NEXT} label="קדימה" />
        </button>
        <div className="ms-2 flex items-center gap-1 rounded-full bg-slate-100 p-1">
          {SPEEDS.map((s) => (
            <button
              key={s}
              onClick={() => setSpeed(s)}
              className={`rounded-full px-2.5 py-1 font-mono text-xs transition ${
                speed === s ? 'bg-white text-sky-600 shadow' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {s}×
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
