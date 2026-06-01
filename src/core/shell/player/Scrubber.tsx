import { usePlayerStore } from './usePlayerStore'

/** The horizontal progress bar + frame counter, shown in the bottom bar.
 *  The track is two-tone (played = sky, remaining = slate) so it clearly reads
 *  as a progress bar you scrub along. */
export default function Scrubber() {
  const { index, frames, seek } = usePlayerStore()
  const total = frames.length
  const max = Math.max(0, total - 1)
  const pct = max > 0 ? (index / max) * 100 : 0

  return (
    <div dir="ltr" className="ltr flex items-center gap-3">
      <input
        type="range"
        min={0}
        max={max}
        value={index}
        onChange={(e) => seek(Number(e.target.value))}
        className="scrubber h-3 w-full cursor-pointer appearance-none rounded-full ring-1 ring-slate-200"
        style={{
          background: `linear-gradient(to right, #0ea5e9 ${pct}%, #e2e8f0 ${pct}%)`,
        }}
        aria-label="מיקום בהרצה"
      />
      <span className="shrink-0 font-mono text-sm tabular-nums text-slate-600">
        {total ? index + 1 : 0}/{total}
      </span>
    </div>
  )
}
