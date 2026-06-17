import { useRef, useState } from 'react'
import { useAnimationFrame } from 'framer-motion'

interface AutoSweepOpts {
  min: number
  max: number
  /** current value (used to resume from where the user left off) */
  value: number
  /** setter for the swept value */
  onChange: (v: number) => void
  /** full sweep duration per direction, seconds (default 5) */
  seconds?: number
  /** comet-trail length (default 14) */
  trailLen?: number
}

export interface AutoSweep {
  playing: boolean
  toggle: () => void
  stop: () => void
  /** wrap a slider/preset setter with this so a manual touch takes control (stops the sweep) */
  setManual: (v: number) => void
  /** recent values, newest first — feed to a curve as a fading comet trail */
  trail: number[]
}

/**
 * Drives a numeric value back and forth (ping-pong) between min and max like a movie, so every
 * view bound to that value evolves together. Extracted from the MOS master sandbox. A manual touch
 * (setManual) stops the sweep and clears the trail; the trail ring-buffer is exposed for a comet.
 */
export function useAutoSweep({ min, max, value, onChange, seconds = 5, trailLen = 14 }: AutoSweepOpts): AutoSweep {
  const [playing, setPlaying] = useState(false)
  const vRef = useRef(value)
  const dirRef = useRef(1)
  const trailRef = useRef<number[]>([])

  const stop = () => {
    setPlaying(false)
    trailRef.current = []
  }
  const setManual = (v: number) => {
    setPlaying(false)
    trailRef.current = []
    vRef.current = v
    onChange(v)
  }
  const toggle = () => {
    if (!playing) {
      vRef.current = value // resume from the current value
      trailRef.current = []
    }
    setPlaying((p) => !p)
  }

  useAnimationFrame((_, delta) => {
    if (!playing) return
    const d = Math.min(delta, 50) // clamp big gaps (inactive tab)
    const speed = (max - min) / (seconds * 1000)
    let next = vRef.current + dirRef.current * speed * d
    if (next >= max) { next = max; dirRef.current = -1 }
    else if (next <= min) { next = min; dirRef.current = 1 }
    vRef.current = next
    const tr = trailRef.current
    tr.unshift(next)
    if (tr.length > trailLen) tr.length = trailLen
    onChange(Number(next.toFixed(3)))
  })

  return { playing, toggle, stop, setManual, trail: trailRef.current }
}
