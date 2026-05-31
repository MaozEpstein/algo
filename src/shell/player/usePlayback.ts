import { useEffect } from 'react'
import { usePlayerStore } from './usePlayerStore'

const BASE_MS = 1100

/**
 * Drives auto-advance while `playing`. The interval reads the latest store
 * state via getState(); stepFwd() auto-pauses at the end, which flips `playing`
 * to false and tears the interval down through this effect's dependency.
 */
export function usePlayback() {
  const playing = usePlayerStore((s) => s.playing)
  const speed = usePlayerStore((s) => s.speed)

  useEffect(() => {
    if (!playing) return
    const id = setInterval(() => {
      usePlayerStore.getState().stepFwd()
    }, BASE_MS / speed)
    return () => clearInterval(id)
  }, [playing, speed])
}
