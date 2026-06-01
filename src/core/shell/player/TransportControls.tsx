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

/**
 * Compact transport (reset / step / play-pause / speed) — a frosted pill that
 * floats over the visualization canvas, near the content. The scrubber lives
 * separately at the bottom. Keyboard: space=toggle, arrows=step.
 */
export default function TransportControls() {
  const { index, frames, playing, speed, toggle, stepFwd, stepBack, setSpeed, reset } =
    usePlayerStore()
  const atEnd = index >= frames.length - 1

  const btn =
    'grid place-items-center rounded-full text-slate-600 transition hover:bg-slate-100 disabled:opacity-30'

  return (
    <div
      dir="ltr"
      className="ltr flex items-center gap-1 rounded-full bg-white/90 px-2 py-1.5 shadow-xl ring-1 ring-black/5 backdrop-blur-md"
    >
      <button className={`${btn} h-9 w-9`} onClick={reset} title="התחלה" disabled={index === 0}>
        <Icon path={RESET} label="איפוס" />
      </button>
      <button className={`${btn} h-9 w-9`} onClick={stepBack} title="צעד אחורה" disabled={index === 0}>
        <Icon path={STEP_PREV} label="אחורה" />
      </button>
      <button
        className="grid h-12 w-12 place-items-center rounded-full bg-sky-500 text-white shadow-lg shadow-sky-500/30 transition hover:bg-sky-600"
        onClick={toggle}
        title={playing ? 'השהיה' : 'נגן'}
      >
        <Icon path={playing ? PAUSE : PLAY} label={playing ? 'השהיה' : 'נגן'} />
      </button>
      <button className={`${btn} h-9 w-9`} onClick={stepFwd} title="צעד קדימה" disabled={atEnd}>
        <Icon path={STEP_NEXT} label="קדימה" />
      </button>
      <div className="ms-1 flex items-center gap-0.5 rounded-full bg-slate-100 p-0.5">
        {SPEEDS.map((s) => (
          <button
            key={s}
            onClick={() => setSpeed(s)}
            className={`rounded-full px-2 py-0.5 font-mono text-[11px] transition ${
              speed === s ? 'bg-white text-sky-600 shadow' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {s}×
          </button>
        ))}
      </div>
    </div>
  )
}
