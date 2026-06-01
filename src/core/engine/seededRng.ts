/**
 * Tiny deterministic PRNG (mulberry32). Used by randomized algorithms
 * (RandomizedQuicksort / RandomizedSelect in later lectures) so that a given
 * input + seed always produces the same frame list — replayable, shareable,
 * and stable for practice questions.
 */
export function mulberry32(seed: number) {
  let a = seed >>> 0
  return function next(): number {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Random integer in [min, max] inclusive, from a [0,1) generator. */
export function randInt(rng: () => number, min: number, max: number): number {
  return min + Math.floor(rng() * (max - min + 1))
}
