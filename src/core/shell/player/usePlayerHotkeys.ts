import { useEffect } from 'react'
import { usePlayerStore } from './usePlayerStore'

const SPEEDS = [0.5, 1, 2, 4]

type Store = ReturnType<typeof usePlayerStore.getState>

function cycleSpeed(s: Store, dir: number) {
  const i = SPEEDS.indexOf(s.speed)
  const ni = Math.max(0, Math.min(SPEEDS.length - 1, (i === -1 ? 1 : i) + dir))
  s.setSpeed(SPEEDS[ni])
}

function jumpStep(s: Store, dir: number) {
  const steps = s.steps
  if (!steps.length) {
    dir > 0 ? s.stepFwd() : s.stepBack()
    return
  }
  if (dir > 0) {
    const next = steps.find((st) => st.index > s.index)
    if (next) s.seek(next.index)
    else s.seek(s.frames.length - 1)
  } else {
    const prev = [...steps].reverse().find((st) => st.index < s.index)
    s.seek(prev ? prev.index : 0)
  }
}

/**
 * All player keyboard shortcuts in one place. Active while the player is
 * mounted. Ignores typing inside inputs. `toggleHelp` opens the shortcuts
 * overlay (must be a stable callback).
 */
export function usePlayerHotkeys(toggleHelp: () => void) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return
      const s = usePlayerStore.getState()
      switch (e.code) {
        case 'Space':
          e.preventDefault()
          s.toggle()
          return
        case 'ArrowRight':
          e.preventDefault()
          s.stepFwd()
          return
        case 'ArrowLeft':
          e.preventDefault()
          s.stepBack()
          return
        case 'ArrowUp':
          e.preventDefault()
          cycleSpeed(s, +1)
          return
        case 'ArrowDown':
          e.preventDefault()
          cycleSpeed(s, -1)
          return
        case 'Home':
          e.preventDefault()
          s.reset()
          return
        case 'End':
          e.preventDefault()
          s.seek(s.frames.length - 1)
          return
      }
      if (e.key === '.') jumpStep(s, +1)
      else if (e.key === ',') jumpStep(s, -1)
      else if (e.key === 'r' || e.key === 'R') s.reset()
      else if (e.key === '?') {
        e.preventDefault()
        toggleHelp()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [toggleHelp])
}
