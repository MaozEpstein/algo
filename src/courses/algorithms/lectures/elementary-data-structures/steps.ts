import type { Frame } from '@/core/engine/types'

/**
 * Derive navigable step chips from the frame stream: one chip at each phase
 * transition, labelled by the (Hebrew) phase string the generator set. Drives
 * the LocalPlayer step strip.
 */
export function phaseSteps(frames: Frame[]): { label: string; index: number }[] {
  const out: { label: string; index: number }[] = []
  let last: string | undefined
  frames.forEach((f, i) => {
    if (f.phase && f.phase !== last) {
      out.push({ label: f.phase, index: i })
      last = f.phase
    }
  })
  return out
}
