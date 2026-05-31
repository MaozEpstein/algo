import { create } from 'zustand'
import type { Frame } from '@/engine/types'

interface PlayerState {
  frames: Frame[]
  index: number
  playing: boolean
  speed: number
  /** True when the last index change was a multi-step jump (disables animation). */
  jumped: boolean

  load: (frames: Frame[]) => void
  play: () => void
  pause: () => void
  toggle: () => void
  stepFwd: () => void
  stepBack: () => void
  seek: (i: number) => void
  setSpeed: (s: number) => void
  reset: () => void
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  frames: [],
  index: 0,
  playing: false,
  speed: 1,
  jumped: true,

  load: (frames) => set({ frames, index: 0, playing: false, jumped: true }),

  play: () => {
    const { frames, index } = get()
    if (frames.length === 0) return
    if (index >= frames.length - 1) set({ index: 0, playing: true, jumped: true })
    else set({ playing: true })
  },
  pause: () => set({ playing: false }),
  toggle: () => (get().playing ? get().pause() : get().play()),

  stepFwd: () => {
    const { index, frames } = get()
    if (index < frames.length - 1) set({ index: index + 1, jumped: false })
    else set({ playing: false })
  },
  stepBack: () => {
    const { index } = get()
    if (index > 0) set({ index: index - 1, jumped: false, playing: false })
  },

  seek: (i) => {
    const { frames, index } = get()
    const clamped = Math.max(0, Math.min(frames.length - 1, i))
    set({ index: clamped, jumped: Math.abs(clamped - index) > 1, playing: false })
  },

  setSpeed: (s) => set({ speed: s }),
  reset: () => set({ index: 0, playing: false, jumped: true }),
}))

export const selectCurrentFrame = (s: PlayerState): Frame | undefined =>
  s.frames[s.index]
