import type { ReactNode } from 'react'

/**
 * A labeled range control for the sandboxes: a Hebrew/Tex label on the right, the
 * current value on the left, and a sky-filled track. Generic over the raw numeric
 * value — callers map it (e.g. a doping slider passes the log10 exponent and maps
 * to 10^value).
 */
export default function Slider({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  display,
}: {
  label: ReactNode
  value: number
  min: number
  max: number
  step?: number
  onChange: (v: number) => void
  /** Formatted current value shown on the left (e.g. "10¹⁶ cm⁻³"). */
  display: ReactNode
}) {
  const pct = ((value - min) / (max - min || 1)) * 100
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-medium text-slate-600">{label}</span>
        <span className="font-mono text-sm font-semibold text-slate-800">{display}</span>
      </div>
      <input
        dir="ltr"
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="scrubber h-3 w-full cursor-pointer appearance-none rounded-full ring-1 ring-slate-200"
        style={{ background: `linear-gradient(to right, #8b5cf6 ${pct}%, #e2e8f0 ${pct}%)` }}
      />
    </div>
  )
}
